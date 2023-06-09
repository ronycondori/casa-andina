const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { RekognitionClient, IndexFacesCommand, SearchFacesByImageCommand, ListCollectionsCommand } = require('@aws-sdk/client-rekognition');
const { AWS_REGION, ACCESS_KEY, SECRET_ACCESS_KEY } = require('../config');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// recibir imagen y subirla a s3 y guardar facciones en las COLLECTIONS
// Listar facciones guardar en las collections
const indexFace = async (req, res) => {
  if (!req.files && !req.files.face) {
    res.json('no files uploaded');
  }

  try {
    // Subir imagen a la collection
    const clientRekognition = new RekognitionClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
    const imageBuffer = Buffer.from(req.files.face.data, 'base64');
    // parametros para subir la imagen a la collection
    const commandRekognition = new IndexFacesCommand({
      CollectionId: 'casa-andina-faces',
      ExternalImageId: uuidv4(),
      Image: {
        Bytes: imageBuffer,
      },
    });
    const responseRekognition = await clientRekognition.send(commandRekognition);

    // Subir imagen a S3
    const clientS3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
    const commandPutObject = new PutObjectCommand({
      Bucket: 'casa-andina-faces',
      Key: req.files.face.name,
      Body: req.files.face.data,
    });
    const responseS3 = await clientS3.send(commandPutObject);

    console.log(responseRekognition);
    console.log(responseS3);
  } catch (error) {
    console.log(error);
  }
};

// funcion de Reconocimiento facial
const searchFace = async (req, res) => {
  if (!req.files && !req.files.face) {
    res.json('no files uploaded');
  }

  try {
    const client = new RekognitionClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });

    // const imageUint8Array = new Uint8Array(req.files.face.data);
    // const imageBase64 = req.files.face.data.toString('base64');
    // const imageBuffer = loadImageIntoBuffer(imageBase64);
    const imageBuffer = Buffer.from(req.files.face.data, 'base64');

    const input = {
      CollectionId: 'casa-andina-faces',
      Image: {
        Bytes: imageBuffer,
      },
    };

    // instancia del commando buscar caras por iamgen
    const command = new SearchFacesByImageCommand(input);
    // ejecutando el la busqueda de la cara
    const response = await client.send(command);

    // imprimir los resultados de la comparacion
    console.log(response);

    const { FaceMatches } = response;
    // comparando que las comparaciones sean mayores a 99.5 para que sea reconocido correctamente
    const faceFound = FaceMatches.some((face) => face.Similarity > 85.5);

    // si la propiedad FaceMatches es un arreglo vacio es por que no ese encontraron coincidencias
    if (FaceMatches.length > 1) {
      res.json({
        faceFound,
      });
    } else {
      res.json({
        faceFound,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  indexFace,
  searchFace,
};

// aws rekognition list-faces --collection-id casa-andina-faces
// aws rekognition create-collection --collection-id casa-andina-faces
// aws rekognition delete-collection --collection-id casa-andina-faces
