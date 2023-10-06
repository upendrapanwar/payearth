import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function GoToTop() {
    const routePath = useLocation();
    const onTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }

    useEffect(() => {
        onTop()
    }, [routePath]);

    return null;
}

export default GoToTop;