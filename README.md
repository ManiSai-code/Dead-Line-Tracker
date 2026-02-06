# Dead-Line-Tracker

git clone https://github.com/ManiSai-code/Dead-Line-Tracker.git

## install postgresql and create a database named deadline_tracker
## in server>src>main>resources>application.properties cahneg database password to your databases password 
cd Dead-Line-Tracker

cd frontend
npm install


cd ../server
./mvnw clean install


# WorkFlow
git pull origin main ----> so that u can get latest changes.(get changes from github to your laptop)

## for pushing to github
git add .
git commit -m "any message "
git push origin main




















## Start the backend: ./mvnw spring-boot:run --> before in terminal change directory to server cd server

## Start the frontend: npm run dev  ---> change dirsectory to client cd client


