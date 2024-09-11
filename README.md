# CTF2024 (A Page in Time)

### Clone repo
```
git clone https://github.com/keanderss/CTF2024.git
```
### Configure environment
`client/src/components/Timebook.tsx` set the API base url:
```
const API_BASE_URL = http://localhost:5175;
```
`server/index.js` disable cors:
```
app.use(
	cors(/* {
		origin: "https://page-in-time.vercel.app",
		methods: ["GET", "POST"],
	} */)
);
```
### Build and run
```
docker-compose up
```
Visit [localhost](http://localhost:5173)
