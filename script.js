// 게시물을 불러오고 표시하는 비동기 함수
async function loadPosts() {
    // posts.json 파일에서 게시물 데이터를 가져옴
    const posts = await fetch('./markdown/posts.json').then(res => res.json());
    
    // HTML에서 필요한 요소들을 가져옴
    const nav = document.getElementById('posts');        // 게시물 목록을 표시할 네비게이션
    const content = document.getElementById('content');  // 게시물 내용을 표시할 영역
    
    // 각 게시물에 대해 반복
    posts.forEach(post => {
        // 목록 항목(li)과 링크(a) 요소 생성
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = post.title;  // 링크 텍스트를 게시물 제목으로 설정
        
        // 링크 클릭 이벤트 핸들러
        link.onclick = async () => {
            // 해당 게시물의 마크다운 파일을 가져옴
            const markdown = await fetch(`./markdown/${post.file}`).then(res => res.text());
            // 마크다운을 HTML로 변환하여 content 영역에 표시
            content.innerHTML = convertMarkdownToHtml(markdown);
        };
        
        // 생성한 요소들을 DOM에 추가
        li.appendChild(link);
        nav.appendChild(li);
    });
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