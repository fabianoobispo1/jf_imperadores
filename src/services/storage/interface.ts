export interface IStorageProvider {
  upload(file: File): Promise<{ url: string; key: string }>
  delete(path: string): Promise<void>
}
