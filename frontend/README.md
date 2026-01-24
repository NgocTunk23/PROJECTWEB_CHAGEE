Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3000) to view it in your browser.

<!-- RESTART FE -->

xoá package.json nếu cần
docker restart backend_container

<!-- GIT PUSH -->

git branch
git push origin fe_cc

git checkout -b fe_cc
git add .
git commit -m "Đổi FE từ React sang Vite"
git push -u origin fe_cc
