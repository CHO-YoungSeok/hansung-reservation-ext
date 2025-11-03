import './LinkArea.css';

function LinkArea({ url, text, imgSrc, alt }) {
    const handleClick = async (e) => {
        e.preventDefault();
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.update(tab.id, { url }); // 현재 활성 탭에서 이동
    };

    return (
        <a href={url} onClick={handleClick} className="LinkArea">
            <img src={imgSrc} alt={alt} className="LinkArea-img" />
            <span className="LinkArea-text">{text}</span>
        </a>
    );
}

export default LinkArea;