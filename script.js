// 게시물을 불러오고 표시하는 비동기 함수
async function loadPosts() {
    // HTML에서 필요한 요소들을 가져옴
    const nav = document.getElementById('posts');
    const content = document.getElementById('content');

    // List 링크 생성
    const li = document.createElement('li');
    const listLink = document.createElement('a');
    listLink.href = '#';
    listLink.textContent = 'Posts List';  // 목록 보기 링크

    // List 링크 클릭 이벤트 핸들러
    listLink.onclick = async () => {
        // 기존 content 내용을 비움
        content.innerHTML = '';
        
        // posts.json 파일에서 게시물 데이터를 가져옴
        const posts = await fetch('./posts.json').then(res => res.json());
        
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
                content.innerHTML = convertMarkdownToHtml(markdown);
            };
            
            postLi.appendChild(postLink);
            postsList.appendChild(postLi);
        });
        
        content.appendChild(postsList);
    };
    
    // nav에 List 링크만 추가
    li.appendChild(listLink);
    nav.appendChild(li);
}

// 마크다운 텍스트를 HTML로 변환하는 함수
function convertMarkdownToHtml(markdown) {
    return markdown
        // 제목 변환 (h1, h2, h3)
        .replace(/^# (.+)/gm, '<h1>$1</h1>')      // # 제목 -> <h1>제목</h1>
        .replace(/^## (.+)/gm, '<h2>$1</h2>')     // ## 제목 -> <h2>제목</h2>
        .replace(/^### (.+)/gm, '<h3>$1</h3>')    // ### 제목 -> <h3>제목</h3>
        
        // 텍스트 스타일 변환
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // **굵은글씨** -> <strong>굵은글씨</strong>
        .replace(/\*(.+?)\*/g, '<em>$1</em>')             // *기울임* -> <em>기울임</em>
        
        // 링크 변환
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')  // [텍스트](링크) -> <a href="링크">텍스트</a>
        
        // 줄바꿈 변환
        .replace(/\n/g, '<br>');                          // \n -> <br>
}

// 페이지 로드 시 게시물 목록 불러오기
loadPosts();
