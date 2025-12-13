# Render Hosting Setup TODO

## Completed Tasks
- [x] Create root-level `render.yaml` file defining MongoDB database, backend web service, and frontend static site service
- [x] Update `backend/render.yaml` to include DB_CONNECTION and other required environment variables

## Pending Tasks
- [ ] Deploy the services using Render (via CLI or web interface)
  - Connect your GitHub repository to Render
  - Use the root `render.yaml` for multi-service deployment
  - Or deploy backend and frontend separately using their individual render.yaml files
- [ ] Update frontend axios baseURL in `frontend/src/helper/axiosInstance.js` if backend URL changes after deployment
- [ ] Generate and set a secure JWT_PRIVATE secret in Render environment variables
- [ ] Set up MongoDB connection string in Render (if using separate deployments)
- [ ] Test the deployed application to ensure all services work correctly
