import Carousel from 'react-bootstrap/Carousel';

const slides = [
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/teacher-training-diploma-programme-lyceum-campus-1.webp",
    alt: "Teacher Training Diploma Programme",
    caption: "Teacher Training Diploma Programme",
  },
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/deakin-pathway-programme-lyceum-campus-2.webp",
    alt: "Deakin Pathway Programme",
    caption: "Deakin Pathway Programme",
  },
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/lyceum-global-foundation-programme-lyceum-campus.webp",
    alt: "Lyceum Global Foundation Programme",
    caption: "Lyceum Global Foundation Programme",
  },
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/bed-hons-primary-education-programme-lyceum-campus-1.webp",
    alt: "BEd (Hons) Primary Education Programme",
    caption: "BEd (Hons) Primary Education Programme",
  },
  {
    src: "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/home-banners/mobile/early-childhood-education-programme-lyceum-campus-1.webp",
    alt: "Early Childhood Education Programme",
    caption: "Early Childhood Education Programme",
  },
];

function DarkVariantExample() {
  return (
    <>
      {/* Inline media query styles for this page only */}
      <style>{`
        .carousel-wrapper {
          margin-top: 130px; /* Desktop default */
        }

        /* Tablet (768px - 1023px) */
        @media (max-width: 1023px) {
          .carousel-wrapper {
            margin-top: 80px;
          }
        }

        /* Mobile (0px - 767px) */
        @media (max-width: 767px) {
          .carousel-wrapper {
            margin-top: 70px;
          }
        }
      `}</style>

      <div className="carousel-wrapper">
        <Carousel data-bs-theme="dark" interval={3000} pause="hover">
          {slides.map((slide, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={slide.src}
                alt={slide.alt}
              />
              <Carousel.Caption>
                <h5>{slide.caption}</h5>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default DarkVariantExample;
