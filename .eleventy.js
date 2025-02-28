import sass from "sass";
import fs from "fs";
import fg from "fast-glob";

export default function (eleventyConfig) {
  // ✅ Ensure full images directory (including gallery) is copied
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });

  // ✅ Ensure JavaScript files are copied
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });

  // ✅ Watch CSS and JS files for changes
  eleventyConfig.addWatchTarget("src/assets/css");
  eleventyConfig.addWatchTarget("src/assets/js");

  // ✅ Compile SASS before Eleventy builds
  eleventyConfig.on("beforeBuild", () => {
    const result = sass.renderSync({ file: "src/assets/css/styles.scss" });

    // Ensure the output directories exist
    fs.mkdirSync("dist/assets/css", { recursive: true });
    fs.writeFileSync("dist/assets/css/styles.css", result.css);

    // Ensure the CSS is copied properly
    eleventyConfig.addPassthroughCopy({
      "dist/assets/css/styles.css": "assets/css/styles.css",
    });
  });

  // ✅ Layout alias
  eleventyConfig.addLayoutAlias("default", "_includes/base-layout.njk");

  // ✅ Correctly fetch gallery images from the right folder
  const galleryImages = fg.sync(
    "src/assets/images/trey/*.{jpg,png,gif,webp,svg}"
  );

  eleventyConfig.addCollection("gallery", () => {
    return galleryImages.map((img) => {
      return `/assets/images/trey/${img.split("/").pop()}`;
    });
  });

  // ✅ Debugging Log
  eleventyConfig.on("afterBuild", () => {
    console.log("✅ Gallery images found:", galleryImages);
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
