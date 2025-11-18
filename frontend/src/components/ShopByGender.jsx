import React, { useEffect, useState } from "react";

export default function ShopByGender() {
  const HEADER_HEIGHT_PX = 120;

  const desktopImages = [
    "https://res.cloudinary.com/duc9svg7w/image/upload/v1763377364/0954ac19-8461-4553-8d0a-0ec279eada25.png",
    "https://res.cloudinary.com/duc9svg7w/image/upload/v1763375956/15a07875-43f8-4026-b9ac-a9f2ce416412.png",
    "https://res.cloudinary.com/duc9svg7w/image/upload/v1763376016/954a65d1-cbd4-458a-b8d2-050cc8bd48a8.png",
    "https://res.cloudinary.com/duc9svg7w/image/upload/v1763376933/abde0159-3ccb-47c4-b123-d926a50b481d.png",
  ];

  const mobileImages = [
    "https://vastramay.com/cdn/shop/files/home_sbg_1311_men_mob_230x.progressive.jpg?v=1763045003",
    "https://vastramay.com/cdn/shop/files/home_sbc_2_mob_230x.progressive.jpg?v=1763018424",
    "https://vastramay.com/cdn/shop/files/home_sbc_3_mob_230x.progressive.jpg?v=1763018466",
    "https://vastramay.com/cdn/shop/files/home_sbc_4_mob_230x.progressive.jpg?v=1763018528",
  ];

  // tweak these values per-image to control how each image is cropped
  const desktopPositions = [
    "center center",
    "center center",
    "center center",
    "center center",
  ];

  // mobile positions tuned to keep subjects visible on narrow crops
  const mobilePositions = [
    "center top",    // men - keep head/top visible
    "center center", // second - center is fine
    "center center", // third - center is fine
    "center top",    // fourth - keep top visible
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const images = isMobile ? mobileImages : desktopImages;
  const positions = isMobile ? mobilePositions : desktopPositions;

  const gridWrapperStyle = {
    height: `calc(100vh - ${HEADER_HEIGHT_PX}px)`,
  };

  return (
    <section className="hidden md:block w-full min-h-screen overflow-hidden">
      <div
        className="w-full flex flex-col items-center justify-center bg-white"
        style={{ height: HEADER_HEIGHT_PX }}
      >
        <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-3 tracking-wide" style={{ fontFamily: 'serif' }}>
          Shop by Gender
        </h2>
        <p className="text-base md:text-lg text-gray-600 font-light italic">
          Styled for All
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-0 w-full"
        style={gridWrapperStyle}
      >
        {images.map((image, idx) => (
          <div key={idx} className="w-full h-full overflow-hidden">
            <img
              src={image}
              srcSet={`${mobileImages[idx]} 480w, ${desktopImages[idx]} 960w`}
              sizes="(max-width: 640px) 100vw, 50vw"
              alt={`tile-${idx}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: positions[idx] || "center center",
                display: "block",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
