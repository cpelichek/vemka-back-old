sudo -u root apt-get update

#installs node
sudo -u root cd ~
sudo -u root curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo -u root bash nodesource_setup.sh
sudo -u root apt-get install nodejs
sudo -u root apt-get install build-essential

#installs nginx
sudo -u root apt-get install nginx
sudo -u root ufw allow 'Nginx Full'

#installs mongodb
sudo -u root apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
sudo -u root echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
sudo -u root apt-get update
sudo -u root apt-get install -y mongodb-org

#installs pm2 - process mananger for node
sudo -u root npm install pm2 -g

#installs dependencys for this project
sudo -u root npm install

#opens vim to configure the reverse proxy 
#sudo -u root vim /etc/nginx/nginx.conf

#starts mongod service
sudo -u root service mongod start

#starts node backend process
sudo -u root pm2 start backend.js

#creates our unique indexes on the db
#check if this works
#sudo -u root mongo && db.usuarios.createIndex({username :1}, {unique : true} )                                                                                                                                                            
