import sass from "sass";
import fs from "fs";
import fg from "fast-glob";

export default function (eleventyConfig) {
  // ✅ Passthrough copy for images (Ensures gallery images are copied)
  eleventyConfig.addPassthroughCopy({
    "src/assets/images/gallery": "assets/images/gallery",
  });

  // ✅ Passthrough copy for other assets
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/js/site.js");

  // ✅ Watch SASS files for changes
  eleventyConfig.addWatchTarget("src/assets/css");

  // ✅ Compile SASS before Eleventy builds
  eleventyConfig.on("beforeBuild", () => {
    const result = sass.renderSync({ file: "src/assets/css/styles.scss" });

    // Ensure the output directory exists before writing the file
    fs.mkdirSync("dist/assets/css", { recursive: true });
    fs.writeFileSync("dist/assets/css/styles.css", result.css);

    // Passthrough the generated CSS file
    eleventyConfig.addPassthroughCopy({
      "dist/assets/css/styles.css": "assets/css/styles.css",
    });
  });

  // ✅ Layout aliasing
  eleventyConfig.addLayoutAlias("default", "_includes/base-layout.njk");

  // ✅ Get images from `/src/assets/images/gallery`
  const galleryImages = fg.sync([
    "src/assets/images/gallery/*.{jpg,png,gif,webp,svg}",
  ]);

  // ✅ Create gallery collection with correct paths
  eleventyConfig.addCollection("gallery", () =>
    galleryImages.map((img) => `/assets/images/gallery/${img.split("/").pop()}`)
  );

  // ✅ Debugging logs to check if images are found
  eleventyConfig.on("afterBuild", () => {
    console.log("✅ Gallery images:", galleryImages);
  });

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
