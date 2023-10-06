import { isLogin } from "./login";

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if(serializedState === null) {
            return undefined;
        }
        const currentUser = isLogin();
        if(!currentUser) {
            return JSON.parse(serializedState);
        } else {
            return undefined;
        }   
        
    } catch(err) {
        return undefined;
    }

};

export const saveState = (state) => {
    try{
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch(err) {
        return undefined;
    }
}