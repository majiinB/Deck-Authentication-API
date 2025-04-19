// StorageService.ts
import {BaseResponse} from "../models/BaseResponse";
import {StorageRepository} from "../repositories/StorageRepository";

/**
 * Service class responsible for handling file upload operations.
 * This class interacts with the `StorageRepository`
 * to upload files to Firebase Storage.
 */
export class StorageService {
  private storageRepository: StorageRepository;

  /**
   * Initializes the StorageService with the required StorageRepository.
   *
   * @param {storageRepository} storageRepository -
   * The repository used to interact with Firebase Storage.
   */
  constructor(storageRepository: StorageRepository) {
    this.storageRepository = storageRepository;
  }

  /**
   * Uploads a file to Firebase Storage via the `StorageRepository`.
   *
   * @param {Buffer} buffer - The file's binary data (buffer) to be uploaded.
   * @param {string} uid - The unique identifier of the user uploading the file.
   * @param {string} mimeType - The MIME type of the file (image/png, etc.).
   * @param {string} folder -
   * The folder where the file will be stored in Firebase Storage.
   *
   * @return {Promise<BaseResponse>} -
   * A response object indicating success or failure.
   *   - `success: true` if file upload is successful with the download URL.
   *   - `success: false` with an error message if upload fails.
   *
   * @example
   * const uploadResponse = await storageService.upload(
   *   file.buffer,
   *   "user-12345",
   *   file.mimetype,
   *   "userPhotos"
   * );
   */
  public async upload(
    buffer: Buffer,
    uid: string,
    mimeType: string,
    folder: string
  ): Promise<BaseResponse> {
    const url = await this.storageRepository
      .uploadFile(buffer, uid, mimeType, folder);

    if (!url) {
      return {success: false, message: "Upload failed"};
    }

    return {success: true, message: url};
  }
}
