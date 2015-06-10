var path = require('path');

//Postgres DATABASE_URL = postgres://
//SQLite  DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

console.log("database_url=" + process.env.DATABASE_URL);
console.log("storage=" + storage);
console.log("vars=" + DB_name +","+ user +"," + pwd +","+ protocol +","+ dialect +","+ port +","+ host);

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
//var sequelize = new Sequelize(null, null, null,
//					{ dialect: "sqlite",
//					  storage: "quiz.sqlite"}
//					  );
var sequelize = new Sequelize(DB_name, user, pwd,
					{ dialect: protocol,
					  protocol: protocol,
					  port: port,
					  host: host,
					  storage: storage, //solo SQLite (.env)
					  omiNull: true  //solo Postgres
					}
					  );

//Importar definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; //exportar definicion tabla Quiz

//sequelize.sync() crea e inicializa tabla preguntas
sequelize.sync().success(function() {
	//success(..) ejecuta manejador una vez creada la tabla
	Quiz.count().success(function(count) {
		if (count === 0) {  //se inicializa tabla si está vacia
			Quiz.create({ pregunta: 'Capital de Italia',
						  respuesta: 'Roma'
						})
			.success(function() {
				console.log('Base de datos inicializada')
			});
		};
	});
});
