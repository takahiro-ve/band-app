import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// あなたのSupabaseのURLとanonキーを貼り付けてください
const SUPABASE_URL = 'https://dkcmijnkkndawfdnvabz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrY21pam5ra25kYXdmZG52YWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzIyNjAsImV4cCI6MjA2NjM0ODI2MH0.FHM2RywwPa-eZzCoz5EovG61Qqd-v0hqsEh24PYaeF0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 募集一覧の取得
async function loadRecruitList() {
  const list = document.getElementById('recruitList');
  list.innerHTML = '';
  const { data, error } = await supabase.from('recruits').select('*').order('created_at', { ascending: false });
  if (error || !data || data.length === 0) {
    list.innerHTML = '<li>まだ募集はありません</li>';
    return;
  }
  data.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.band}</strong> / ${item.part}<br>
      ${item.message ? `<span>${item.message}</span><br>` : ''}
      <span style="color:#007bff;">${item.contact}</span>
      <button style="margin-left:12px;" onclick="deleteRecruit(${item.id})">削除</button>`;
    list.appendChild(li);
  });
}

// 募集投稿
document.getElementById('recruit-submit').onclick = async () => {
  const band = document.getElementById('band').value.trim();
  const part = document.getElementById('part').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!band || !part || !contact) {
    alert('バンド名・募集パート・連絡先は必須です');
    return;
  }
  const { error } = await supabase.from('recruits').insert([{ band, part, contact, message }]);
  if (error) {
    alert('投稿に失敗しました: ' + error.message);
    return;
  }
  document.getElementById('band').value = '';
  document.getElementById('part').value = '';
  document.getElementById('contact').value = '';
  document.getElementById('message').value = '';
  loadRecruitList();
};

// 削除
window.deleteRecruit = async function(id) {
  if (!confirm('この募集を削除しますか？')) return;
  const { error } = await supabase.from('recruits').delete().eq('id', id);
  if (error) {
    alert('削除に失敗しました: ' + error.message);
    return;
  }
  loadRecruitList();
};

loadRecruitList();