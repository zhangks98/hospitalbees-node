README for DATABASE:
1)To run the program, please run the app.js on your cmd!
2) Don't forget to load provided SQL file in MySQL
3)/api/user/<nric> means:
	for example, user has nric 123456, so in the url please use /api/user/123456 
4)I recommend you guys use POSTMAN for trying mycode and find the error, thank you.

Here are several query that is provided:


*POST http://localhost:8080/api/user
For: Create new user
body: name (String)
      phoneNumber(String)
return: HTML response 201 (success)
	HTML response 404 (failed) 


*PUT http://localhost:8080/api/user/<phoneNumber>/blockAccount
For: Set the account to blocked (binary: TRUE)
body: -
return: HTML response 200 (success)
	HTML response 404 (failed)

*GET http://localhost:8080/api/user/<phoneNumber>
For: Get user data
body: -
return: User JSON file (success)
	HTML response 404 (failed) 


*DELETE http://localhost:8080/api/user/<phoneNumber>
For: Delete the user
body: -
return: HTML Response 200 (success)
	HTML response 404 (failed)


*PUT http://localhost:8080/api/user/<phoneNumber>/changeProfile
For: Change user profile (especially phone number)
body: id (int)
      name (String)
return: HTML Response 200 (success)
	HTML Response 404 (failed)


*GET http://localhost:8080/api/user/<phoneNumber>/history
For: Return the information regarding all booking
body: -
return: JSON file ALL booking history (success)
	HTML Response 404 (failed)
 
*PUT http://localhost:8080/api/user/<phoneNummber>/fcmToken/<NewFCMToken>
For: Update the FCM Token to the database
body: -
return: HTML response 200 (success)
	HTML response 404 (failed)


POST http://localhost:8080/api/booking
For: Add new booking
body: time(String)(XXXX-XX-XX XX:XX:XX)
	  queueStatus (ENUM 'INACTIVE', 'ACTIVE', 'FINISHED')
	  bookingStatus (ENUM 'PENDING', 'COMPLETED', 'ABSENT', 'CANCELLED')
	  queueNumber (String) (XXXX)
	  userID (int)
	  hospitalID (int)
Return: TID (String)

PUT //localhost:8080/api/booking/<tid>/QSUpdateToActive
For: Change queue status (QS) to 'ACTIVE'
body: -
Return: String ('ACTIVE');


PUT //localhost:8080/api/booking/<tid>/QSUpdateToMissed
For: Change queue status (QS) to 'MISSED'
body: -
Return: String ('MISSED');



PUT //localhost:8080/api/booking/<tid>/BSUpdateToCompleted
For: Change booking status to 'COMPLETED' and QS to 'FINISHED'
body: -
Return: String ('COMPLETED');



PUT //localhost:8080/api/booking/<tid>/BSUpdateToAbsent
For: Change booking status to 'ABSENT' and QS to 'FINISHED'
body: -
Return: String ('ABSENT');


PUT //localhost:8080/api/booking/<tid>/BSUpdateToCancelled
For: Change booking status to 'CANCELLED' and QS to 'FINISHED'
body: -
Return: String ('CANCELLED');


GET //localhost:8080/api/hospital/<hospitalname>
For: Get hospital data (HospitalID, Name, Address, StartingHours, ClosingHours)
body: -
Return: JSON File;