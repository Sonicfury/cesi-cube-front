export interface HydraPagedCollectionInterface<T> {
  discriminator: HydraDiscriminator.pagedCollection;
  "hydra:totalItems": number;
  "hydra:member": T[];
  "@context": string;
  "@id": string;
  "@type"?: string;
  "hydra:view"?: {
    "@id"?: string;
    "@type"?: string;
    "hydra:first"?: string;
    "hydra:last"?: string;
    "hydra:previous"?: string;
    "hydra:next"?: string;
  };
}

export interface HydraCollectionInterface<T> {
  discriminator: HydraDiscriminator.collection;
  "hydra:totalItems": number;
  "hydra:member": T[];
  "@context": string;
  "@id": string;
  "@type"?: string;
}

export enum HydraDiscriminator {
  pagedCollection,
  collection
}
