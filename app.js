import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// あなたのSupabaseのURLとanonキーを貼り付けてください
const SUPABASE_URL = 'https://dkcmijnkkndawfdnvabz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrY21pam5ra25kYXdmZG52YWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzIyNjAsImV4cCI6MjA2NjM0ODI2MH0.FHM2RywwPa-eZzCoz5EovG61Qqd-v0hqsEh24PYaeF0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// バンド作成
document.getElementById('submit').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const leader = document.getElementById('leader').value;
  const genre = document.getElementById('genre').value;
  const song = document.getElementById('song').value;

  if (!name || !leader) return alert("バンド名と代表者名は必須です");

  const { error } = await supabase.from('bands').insert([
    { name, leader, genre, song }
  ]);

  if (error) {
    alert('登録に失敗しました: ' + error.message);
  } else {
    alert('バンドを登録しました！');
    loadBands(); // 一覧再読み込み
  }
});

// 一覧表示
async function loadBands() {
  const { data, error } = await supabase.from('bands').select('*').order('created_at', { ascending: false });

  const list = document.getElementById('bandList');
  list.innerHTML = '';

  if (error) {
    list.innerHTML = '<li>読み込みに失敗しました</li>';
    return;
  }

  data.forEach(band => {
    const li = document.createElement('li');
    li.textContent = `${band.name}（${band.genre}） - ${band.song} ／ 代表：${band.leader}`;

    // 削除ボタンを追加
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.style.marginLeft = '12px';
    deleteBtn.onclick = async () => {
      if (confirm(`「${band.name}」を削除しますか？`)) {
        const { error } = await supabase.from('bands').delete().eq('id', band.id);
        if (error) {
          alert('削除に失敗しました: ' + error.message);
        } else {
          loadBands();
        }
      }
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

loadBands(); // 初期読み込み
