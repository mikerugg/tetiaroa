/** Keep the authenticated Studio preview and public Portable Text media in sync. */
export const guideBodyProjection = `[]{
  ...,
  _type == "image" => {
    "url": asset->url,
    "alt": coalesce(alt, asset->altText, ""),
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  _type in ["audio", "audioEmbed", "audioPlayer", "documentLink", "fileLink"] => {
    "url": coalesce(file.asset->url, url)
  }
}`;
