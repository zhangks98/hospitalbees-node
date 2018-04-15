README for DATABASE:
1)To run the program, please run the REST.js on your cmd!
2) Don't forget to load provided SQL file in MySQL
3)/api/user/<nric> means:
	for example, user has nric 123456, so in the url please use /api/user/123456 
4)I recommend you guys use POSTMAN for trying mycode and find the error, thank you.

Here are several query that is provided:



POST http://localhost:8080/api/user
For: Create new user
argument: nric (String)
      	  name (String)
	  password (String)
	  phoneNumber (String)
return: String ("User created")

PUT http://localhost:8080/api/user/<nric>/blockAccount
For: Set the account to blocked (binary: TRUE)
argument: -
return: String("Blocked")

GET http://localhost:8080/api/user/<nric>/<password>
For: Get user data
argument: -
return: JSON file 


DELETE http://localhost:8080/api/user/<nric>
For: Delete the user
argument: -
return: String("The account has been deleted")


PUT http://localhost:8080/api/user/<nric>/changeProfile
For: Change user profile excluding password
argument: id (int)
	  name (String)
	  nric (String)
	  phoneNumber (String)
return: String("Profile has been updated")


PUT http://localhost:8080/api/user/<nric>/changePassword
For: Change user profile excluding password
argument: oldpassword (String)
	  newpassword (String)
	  confirmpassword (String)
return: String("The Password has been updated")


GET http://localhost:8080/api/user/<userid>/pending
For: Return the information regarding current booking
argument: -
return: JSON file


GET http://localhost:8080/api/user/<userid>/history
For: Return the information regarding all booking
argument: -
return: JSON file


POST http://localhost:8080/api/booking
For: Add new booking
argument: time(String)(XXXX-XX-XX XX:XX:XX)
	  queueStatus (ENUM 'INACTIVE', 'ACTIVE', 'FINISHED')
	  bookingStatus (ENUM 'PENDING', 'COMPLETED', 'ABSENT', 'CANCELLED')
	  queueNumber (String) (XXXX)
	  userID (int)
	  hospitalID (int)
Return: TID (String)

PUT //localhost:8080/api/booking/<tid>/QSUpdateToActive
For: Change queue status (QS) to 'ACTIVE'
argument: -
Return: String ('ACTIVE');


PUT //localhost:8080/api/booking/<tid>/QSUpdateToMissed
For: Change queue status (QS) to 'MISSED'
argument: -
Return: String ('MISSED');



PUT //localhost:8080/api/booking/<tid>/BSUpdateToCompleted
For: Change booking status to 'COMPLETED' and QS to 'FINISHED'
argument: -
Return: String ('COMPLETED');



PUT //localhost:8080/api/booking/<tid>/BSUpdateToAbsent
For: Change booking status to 'ABSENT' and QS to 'FINISHED'
argument: -
Return: String ('ABSENT');


PUT //localhost:8080/api/booking/<tid>/BSUpdateToCancelled
For: Change booking status to 'CANCELLED' and QS to 'FINISHED'
argument: -
Return: String ('CANCELLED');


GET //localhost:8080/api/hospital/<hospitalname>
For: Get hospital data (HospitalID, Name, Address, StartingHours, ClosingHours)
argument: -
Return: JSON File;