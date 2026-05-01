export default function Polaroid({ image, date, caption }) {
  return (
    <div className="polaroid">
      <img src={image} alt="polaroid" className="polaroid-img" />

      <div className="polaroid-footer">
        <span className="polaroid-date">{date}</span>
        <span className="polaroid-caption">{caption}</span>
      </div>
    </div>
  );
}