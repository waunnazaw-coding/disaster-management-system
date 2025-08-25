export interface ImpactCreateDto {
  Type: string;
    Value?: string | null;
  objectName?: string | null;
}

export interface ReportImpactCreateDto {
  locationName: string;
  address?: string | null;
  region?: string | null;
  country?: string | null;
  geoJson: string;

  addressDetail?: string | null;
  type: string;
  title?: string | null;
  description?: string | null;
  severity?: string | null;
  source?: string | null;
  status?: string | null;

  reportPhotos: File[];    // IFormFile[] -> File[]
  newPhotoDescription: string[];
  impactsJson: string
}
