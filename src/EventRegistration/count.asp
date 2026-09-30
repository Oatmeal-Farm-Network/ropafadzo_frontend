<%


		Query =  "INSERT INTO Stats ( AnimalID,  Statdate)" 
		Query =  Query + " Values ('" &  ID & "'," 
		Query =  Query + " '" &  FormatDateTime(Now , 2)  & "')"

'response.write(Query)

Set DataConnection = Server.CreateObject("ADODB.Connection")
DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) & ";" 
DataConnection.Execute(Query) 

DataConnection.Close
Set DataConnection = Nothing 

%>

