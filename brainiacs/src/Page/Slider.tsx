import React from "react";
import Carousel from "react-bootstrap/Carousel";

interface Slide {
  src: string;
}

const slides: Slide[] = [
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/teacher-training-diploma-programme-lyceum-campus-1.webp",
  },
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/deakin-pathway-programme-lyceum-campus-2.webp",
  },
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/lyceum-global-foundation-programme-lyceum-campus.webp",
  },
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/bed-hons-primary-education-programme-lyceum-campus-1.webp",
  },
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/early-childhood-education-programme-lyceum-campus-1.webp",
  },
];

const DarkVariantExample: React.FC = () => {
  // 👉 Function method to render slides
  const renderSlides = () =>
    slides.map((slide, index) => (
      <Carousel.Item key={index}>
        <img className="d-block w-100" src={slide.src}  />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
    ));

  return (
    <Carousel data-bs-theme="dark" interval={3000} fade>
      {renderSlides()}
    </Carousel>
  );
};

export default DarkVariantExample;
