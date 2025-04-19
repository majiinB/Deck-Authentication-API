import {FirebaseAdmin} from "../config/firebaseAdmin";
import {v4 as uuidv4} from "uuid";
/**
 * Responsible for handling the storage queries
 * @extends FirebaseAdmin
 */
export class StorageRepository extends FirebaseAdmin {
  /**
   * Uploads a file to Firebase Storage and returns a download URL.
   * This method interacts with Firebase's Storage service to
   * upload the file and generate a secure download URL that
   * can be used to access the file.
   *
   * @param {Buffer} buffer - The binary data of the file to be uploaded.
   * @param {string} uid - The unique identifier
   * for the user uploading the file.
   * @param {string} mimeType - The MIME type of the file
   * (e.g., image/png, application/pdf).
   * @param {string} folder - The folder within Firebase Storage
   * where the file will be saved.
   *
   * @return {Promise<string>} - A promise that resolves to
   * a string containing the file's download URL.
   *
   * @example
   * // Example of calling the uploadFile function in a repository:
   * const downloadURL = await storageRepository.uploadFile(
   * file.buffer, "user-12345", file.mimetype, "userPhotos"
   * );
   * console.log(downloadURL); // URL of the uploaded file
   *
   * @throws {Error} - If there is an error during
   * the upload process, the promise will be rejected.
   */
  public async uploadFile(
    buffer: Buffer,
    uid: string,
    mimeType: string,
    folder: string
  ): Promise<string> {
    const bucket = this.getStorage().bucket();
    const fileName = `${folder}/${uid}-${Date.now()}`;
    const file = bucket.file(fileName);
    const uuid = uuidv4();

    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });

    return new Promise((resolve, reject) => {
      stream.on("error", (err) => reject(err));
      stream.on("finish", async () => {
        // es-lint-disable-next-line max-len
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`;
        resolve(downloadURL);
      });
      stream.end(buffer);
    });
  }
}
