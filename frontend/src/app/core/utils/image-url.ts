import { environment } from '../../../environments/environment';

export function resolveImageUrl(image: string): string {
  if (!image || image.startsWith('http')) {
    return image;
  }
  return `${environment.apiOrigin}/images/${image}`;
}
