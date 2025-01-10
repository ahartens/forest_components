export function showModalView(show, pageId){
    const page = document.getElementById(pageId);
    if (show == true){
        page.classList.remove('hide');
        page.classList.add('show');
    }
    else{
        page.classList.remove('show');
        page.classList.add('hide');
    }

}
