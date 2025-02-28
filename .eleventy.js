import sass from "sass";
import fs from "fs";
import fg from "fast-glob";

export default function (eleventyConfig) {
  // ✅ Ensure images and their subfolders are copied
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });

  // ✅ Watch SASS files
  eleventyConfig.addWatchTarget("src/assets/css");

  // ✅ Compile SASS before Eleventy builds
  eleventyConfig.on("beforeBuild", () => {
    const result = sass.renderSync({ file: "src/assets/css/styles.scss" });

    // Ensure the output directory exists
    fs.mkdirSync("dist/assets/css", { recursive: true });
    fs.writeFileSync("dist/assets/css/styles.css", result.css);

    // Passthrough CSS
    eleventyConfig.addPassthroughCopy({
      "dist/assets/css/styles.css": "assets/css/styles.css",
    });
  });

  // ✅ Layout alias
  eleventyConfig.addLayoutAlias("default", "_includes/base-layout.njk");

  // ✅ Use correct relative paths for Netlify
  const galleryImages = fg.sync(
    "src/assets/images/gallery/*.{jpg,png,gif,webp,svg}"
  );

  eleventyConfig.addCollection("gallery", () =>
    galleryImages.map((img) => `/assets/images/gallery/${img.split("/").pop()}`)
  );

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
