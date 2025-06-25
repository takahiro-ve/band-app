import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// あなたのSupabaseのURLとanonキーを貼り付けてください
const SUPABASE_URL = 'https://dkcmijnkkndawfdnvabz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrY21pam5ra25kYXdmZG52YWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzIyNjAsImV4cCI6MjA2NjM0ODI2MH0.FHM2RywwPa-eZzCoz5EovG61Qqd-v0hqsEh24PYaeF0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 仮のバンドデータ配列
let bands = [];

// バンドをリストに表示する関数
function renderBandList() {
  const bandList = document.getElementById('bandList');
  bandList.innerHTML = '';
  bands.forEach((band, index) => {
    const li = document.createElement('li');
    li.textContent = `${band.name}（代表: ${band.leader}／ジャンル: ${band.genre}／曲: ${band.song}）`;

    // 削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.onclick = () => {
      bands.splice(index, 1);
      renderBandList();
    };

    li.appendChild(deleteBtn);
    bandList.appendChild(li);
  });
}

// バンド作成ボタンの処理
document.getElementById('submit').onclick = () => {
  const name = document.getElementById('name').value;
  const leader = document.getElementById('leader').value;
  const genre = document.getElementById('genre').value;
  const song = document.getElementById('song').value;
  if (name && leader && genre && song) {
    bands.push({ name, leader, genre, song });
    renderBandList();
    // 入力欄をクリア
    document.getElementById('name').value = '';
    document.getElementById('leader').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('song').value = '';
  }
};

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
    list.appendChild(li);
  });
}

loadBands(); // 初期読み込み
