import './BtnLink.css';

function BtnLink({url, text, imgSrc, alt}) {
    return (
        <button onClick={() => {window.location.href = url}} className="BtnLink" >
            <img src={imgSrc} alt={alt} className="BtnLink-img"/>
            <text className="BtnLink-text">{text}</text>
        </button>
    );
}

export default BtnLink;