const fs = require('fs');
const path = require('node:path');

class StorageService {
	/**
	 * @param {string} directory
	 */
	constructor(directory) {
		this._directory = directory;

		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory, { recursive: true });
		}
	}

	/**
	 * @param {ReadableStream} file
	 * @param {Object} meta
	 * @returns {Promise<string>}
	 */
	writeFile(file, meta) {
		const filename = `${+new Date()}-${meta.filename}`;
		const filePath = path.join(this._directory, filename);

		const fileStream = fs.createWriteStream(filePath);

		return new Promise((resolve, reject) => {
			fileStream.on('error', (error) => reject(error));

			file.pipe(fileStream);
			file.on('end', () => resolve(filename));
		});
	}

	/**
	 * @param {string} filename
	 * @returns {Promise<string>}
	 */
	deleteFile(filename) {
		const directoryPath = path.join(this._directory, filename);

		return new Promise((resolve) => {
			fs.unlink(directoryPath, (error) => {
				if (error) {
					console.error('error: ', error);
				}

				resolve(filename);
			});
		});
	}
}

module.exports = StorageService;
