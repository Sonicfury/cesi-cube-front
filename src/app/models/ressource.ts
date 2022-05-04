export class Ressource {

  constructor(
    private _id: number,
    private _title: string,
    private _mediaUrl: [],
    private _richTextContent: string,
    private _tags: string,
    private _createdAt: Date,
    private _lastUpdatedAt: Date,
    private _deletedAt: Date
  ) {
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get mediaUrl(): [] {
    return this._mediaUrl;
  }

  get richTextContent(): string {
    return this._richTextContent;
  }

  get tags(): string {
    return this._tags;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get lastUpdatedAt(): Date {
    return this._lastUpdatedAt;
  }

  get deletedAt(): Date {
    return this._deletedAt;
  }
}
