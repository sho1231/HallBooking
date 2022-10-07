url:https://hallbooking1231.herokuapp.com


//To register a customer:
path:/users/register
method:post
sample req body:{
	"email":"shourja.ganguly181@gmail.com",
	"name":"Shourja181",
	"pass":"1234"
}


//Login Customer
path:/users/login
method:post
sample req body:{
	"email":"shourja.ganguly129@gmail.com",
	"pass":"1234"
}


//To register a admin
path:/admin/register
method:post
sample req body:{
	"email":"shourja.admin91@gmail.com",
	"name":"Shourja Admin",
	"pass":"1234"
}

//To add a room(can only be done by admin)
path:/admin/createRoom
method:POST
sample req body:{
	"roomName":"B4",
	"numberOfSeats":250,
	"amenties":["Dining Table","Decorations"],
	"price":131
}


//to book a room(Can be done by customer)
path:/users/book
method:POST
sample req body:{
	"date":"10/23/2022",
	"stime":"1:23pm",
	"etime":"8:45pm",
	"roomId":"633f2ab8562c4245549e2f73"
}



//to get rooms with booked data(can only be done by admin)
path:/admin/roomsBookedData
method:GET


//to get customers with booked data(can only be done by admin)
path:/admin/customersBookedData
method:get



