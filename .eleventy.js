import sass from "sass";
import fs from "fs";

export default async function (eleventyConfig) {
  const { default: fg } = await import("fast-glob");

  // Passthrough copy for images
  eleventyConfig.addPassthroughCopy("src/assets/images");

  // Watch SASS files for changes
  eleventyConfig.addWatchTarget("src/assets/css");

  // Compile SASS before Eleventy builds
  eleventyConfig.on("beforeBuild", () => {
    const result = sass.renderSync({ file: "src/assets/css/styles.scss" });

    // Ensure the dist/assets/css folder exists before writing
    fs.mkdirSync("dist/assets/css", { recursive: true });
    fs.writeFileSync("dist/assets/css/styles.css", result.css);

    // Now that the CSS exists, add passthrough copy
    eleventyConfig.addPassthroughCopy({
      "dist/assets/css/styles.css": "assets/css/styles.css",
    });
  });

  // Layout aliasing
  eleventyConfig.addLayoutAlias("default", "_includes/base-layout.njk");

  // Get images from /src/assets/images
  const galleryImages = fg.sync(["src/assets/images/gallery/*", "!dist"]);

  // Create gallery collection with correct public paths
  eleventyConfig.addCollection("gallery", () =>
    galleryImages.map((img) => `/assets/images/gallery/${img.split("/").pop()}`)
  );

  eleventyConfig.addWatchTarget("src/assets/js/site.js");
  eleventyConfig.addPassthroughCopy("src/assets/js/site.js");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
