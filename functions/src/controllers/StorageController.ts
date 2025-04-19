import {Request, Response} from "express";
import {StorageService} from "../services/StorageService";

/**
 * Controller responsible for handling file upload requests.
 * This class interacts with the `StorageService`
 * to upload files to Firebase Storage.
 */
export class StorageController {
  private storageService: StorageService;


  /**
   * Controller responsible for handling file upload requests.
   * This class interacts with the `StorageService`
   * to upload files to Firebase Storage.
   * @param {storageService} storageService - instance
   */
  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }


  /**
   * Handles file upload requests.
   * It expects a file to be included in the request body,
   * and uploads the file to Firebase Storage using the `StorageService`.
   * After the file is uploaded, it returns the download URL as a response.
   *
   * @param {Request} req - The request object from Express,
   *  which contains the uploaded file and other data.
   * @param {Response} res - The response object from Express,
   * used to send back the result of the upload.
   *
   * @return {Promise<void>} -
   * A promise that resolves once the response is sent.
   *
   * @example
   * const formData = new FormData();
   * formData.append('file', fileInput.files[0]);
   * formData.append('uid', 'user-id');
   * formData.append('folder', 'userPhotos');
   *
   * fetch('/api/storage/upload', {
   *   method: 'POST',
   *   body: formData
   * });
   */
  public async uploadHandler(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request | any,
    res: Response
  ): Promise<void> {
    const file = req.file; // The uploaded file
    const {uid, folder} = req.body;

    // Attempt to upload the file via the StorageService
    const downloadURL = await this.storageService.upload(
      file.buffer, // The file buffer (binary data)
      uid, // User ID
      file.mimetype, // The file's MIME type (image/png, etc.)
      folder || "userPhotos" // Default to "userPhotos" if no folder is provided
    );

    // If no download URL is returned, send a bad request response
    if (!downloadURL) {
      res.status(400).json({
        success: false,
        message: "Cannot retrieve download URL",
      });
      return;
    }

    // Send back the signed URL as the response
    res.status(200).json({
      success: true,
      message: downloadURL,
    });
  }
}
