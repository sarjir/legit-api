FROM mongo

COPY init.json /init.json
CMD mongoimport --host database --db legit --collection articles --mode merge --type json --file /init.json --jsonArray