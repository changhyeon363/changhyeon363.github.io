// 마크다운 설정
marked.setOptions({
    breaks: true,        // 줄바꿈 활성화
    gfm: true,          // GitHub Flavored Markdown 활성화


    //삭제됐음.
    //headerIds: true,    // 헤더에 id 추가
    //mangle: false,      // 헤더 id 난독화 비활성화
    //sanitize: false,    // HTML 태그 허용
});

// 시작 페이지 로드 함수
async function loadStartPage() {
    const content = document.getElementById('content');
    const markdown = await fetch('./markdown/start.md').then(res => res.text());
    content.innerHTML = marked.parse(markdown);
}

// 게시물을 불러오고 표시하는 비동기 함수
async function loadPosts() {
    // HTML에서 필요한 요소들을 가져옴
    const nav = document.getElementById('posts');
    const content = document.getElementById('content');
    
    // 홈 링크에 이벤트 리스너 추가
    const homeLink = document.getElementById('homeLink');
    homeLink.onclick = async (e) => {
        e.preventDefault();
        await loadStartPage();
    };

    // List 링크 생성
    const li = document.createElement('li');
    const listLink = document.createElement('a');
    listLink.href = '#';
    listLink.textContent = 'Posts List';  // 목록 보기 링크

    // List 링크 클릭 이벤트 핸들러
    listLink.onclick = async () => {
        content.innerHTML = '';
        
        // posts.json 파일에서 게시물 데이터를 가져옴
        const posts = await fetch('./static/posts.json').then(res => res.json());
        
        // 게시물 목록을 표시할 ul 요소 생성
        const postsList = document.createElement('ul');
        
        // 각 게시물에 대해 반복
        posts.forEach(post => {
            const postLi = document.createElement('li');
            const postLink = document.createElement('a');
            postLink.href = '#';
            postLink.textContent = post.title;
            
            // 게시물 링크 클릭 이벤트 핸들러
            postLink.onclick = async () => {
                const markdown = await fetch(`./markdown/${post.file}`).then(res => res.text());
                content.innerHTML = marked.parse(markdown);
            };
            
            postLi.appendChild(postLink);
            postsList.appendChild(postLi);
        });
        
        content.appendChild(postsList);
    };
    
    li.appendChild(listLink);
    nav.appendChild(li);
}

// 페이지 로드 시 시작 페이지와 게시물 목록 불러오기
window.onload = async () => {
    await loadStartPage();
    await loadPosts();
};
