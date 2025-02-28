import sass from "sass";
import fs from "fs";

export default async function (eleventyConfig) {
  const { default: fg } = await import("fast-glob");

  // ✅ Fix 1: Removed unnecessary passthrough copy for "dist/assets/images"
  eleventyConfig.addPassthroughCopy("src/assets/images");

  // Watch SASS files for changes
  eleventyConfig.addWatchTarget("src/assets/css");

  // ✅ Fix 2: Ensure SASS compiles and copies CSS before Eleventy builds
  eleventyConfig.on("beforeBuild", () => {
    const result = sass.renderSync({ file: "src/assets/css/styles.scss" });

    // Ensure the dist/assets/css folder exists before writing
    fs.mkdirSync("dist/assets/css", { recursive: true });
    fs.writeFileSync("dist/assets/css/styles.css", result.css);

    // Ensure CSS gets copied properly
    eleventyConfig.addPassthroughCopy({
      "dist/assets/css/styles.css": "assets/css/styles.css",
    });
  });

  // Layout aliasing
  eleventyConfig.addLayoutAlias("default", "_includes/base-layout.njk");

  // ✅ Fix 3: Correct gallery collection paths
  const galleryImages = fg.sync(["src/assets/images/gallery/*"]);

  eleventyConfig.addCollection("gallery", () =>
    galleryImages.map((img) => `/assets/images/gallery/${img.split("/").pop()}`)
  );

  // ✅ Fix 4: Ensure JavaScript is copied correctly
  eleventyConfig.addWatchTarget("src/assets/js/site.js");
  eleventyConfig.addPassthroughCopy("src/assets/js/site.js");

  // ✅ Fix 5: Debug log to verify images exist in production
  eleventyConfig.on("afterBuild", () => {
    console.log(
      "✅ Gallery images copied:",
      fg.sync(["dist/assets/images/gallery/*"])
    );
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
