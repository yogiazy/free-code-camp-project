// app.js

const { useState, useEffect } = React;

const App = () => {
    const [quotesData, setQuotesData] = useState([]);
    const [currentQuote, setCurrentQuote] = useState("Let's start our journey!");
    const [currentAuthor, setCurrentAuthor] = useState('Yogiazy');

    const colors = [
        '#16a085',
        '#27ae60',
        '#2c3e50',
        '#f39c12',
        '#e74c3c',
        '#9b59b6',
        '#FB6964',
        '#342224',
        '#472E32',
        '#BDBB99',
        '#77B1A9',
        '#73A857'
    ];

    useEffect(() => {
        const getQuotes = async () => {
            try {
                const response = await fetch('https://raw.githubusercontent.com/yogiazy/free-code-camp-project/master/random-quote-machine/mydata.json');
                const jsonQuotes = await response.json();
                setQuotesData(jsonQuotes.quotes);
            } catch (error) {
                console.error('Error fetching quotes:', error);
            }
        };

        getQuotes();
    }, []);

    const getRandomQuote = () => quotesData[Math.floor(Math.random() * quotesData.length)];
    const getQuote = () => {
        const randomQuote = getRandomQuote();

        setCurrentQuote(randomQuote.quote);
        setCurrentAuthor(randomQuote.author);

        // Update Twitter and Tumblr links here
        const tweetUrl = `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${encodeURIComponent(`"${currentQuote}" ${currentAuthor}`)}`;
        const tumblrUrl = `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=${encodeURIComponent(`${currentAuthor}`)}&content=${encodeURIComponent(`${currentQuote}`)}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button`;

        document.getElementById('tweet-quote').setAttribute('href', tweetUrl);
        document.getElementById('tumblr-quote').setAttribute('href', tumblrUrl);

        // Animation logic
        const color = Math.floor(Math.random() * colors.length);
        document.documentElement.style.setProperty('--main-bg-color', colors[color]);
        document.documentElement.style.setProperty('--text-color', colors[color]);
    };

    return (
        <div className="container text-center">
            <div id="quote-box" className="border rounded p-4 mt-5">
                <div className="quote-text">
                    <i className="fa fa-quote-left"></i><span id="text">{currentQuote}</span>
                </div>
                <div className="quote-author">- <span id="author">{currentAuthor}</span></div>
                <div className="buttons">
                    <a className="button" id="tweet-quote" title="Tweet this quote!" target="_top">
                        <i className="fa fa-twitter"></i>
                    </a>
                    <a className="button" id="tumblr-quote" title="Post this quote on tumblr!" target="_blank">
                        <i className="fa fa-tumblr"></i>
                    </a>
                    <button className="button" id="new-quote" onClick={getQuote}>New quote</button>
                </div>
            </div>
            <div className="footer mt-4">by <a href="https://github.com/yogiazy">yogiazy</a></div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));