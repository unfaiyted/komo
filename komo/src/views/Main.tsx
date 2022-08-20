import {Link} from "react-router-dom";

const Main = () => {
    return (
    <div><h2>Main</h2>
        <ul>
            <li>
                <Link to="/home">Home</Link>
            </li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>

        </ul>
    </div>
        )
}