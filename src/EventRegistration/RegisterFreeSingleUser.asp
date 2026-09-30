<%@ Language=VBScript %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<HEAD>
<title>Single User Registration</title>
       <link rel="stylesheet" type="text/css" href="/style.css">
       <!--#Include virtual="GlobalVariables.asp"-->
</HEAD>
<BODY>
 <!--#Include file="EventHeader.asp"--> 
<%
EventID = request.QueryString("EventID")
PeopleID = request.QueryString("PeopleID")
RegisteredQTY = request.Form("RegisteredQTY")

'response.write("EventID=" & EventID )
'response.write("PeopleID=" & PeopleID )
'response.write("RegisteredQTY=" & RegisteredQTY )

sql2 = "select * from People where PeopleID = " & PeopleID 


    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		PeopleFirstName=rs2("PeopleFirstName")
		PeopleLastName=rs2("PeopleLastName")
		PeopleEmail=rs2("PeopleEmail")
        BusinessID= rs2("BusinessID")
        AddressID= rs2("AddressID")
   end if 

  rs2.close

if len(BusinessID) > 0 then
sql2 = "select * from Business where BusinessID = " & BusinessID

'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		BusinessName=rs2("BusinessName")  
   end if 

  rs2.close
end if 


if len(AddressID) > 0 then
sql2 = "select * from Address where AddressID = " & AddressID

'response.write (sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
   if not rs2.eof then
  
		AddressStreet=rs2("AddressStreet") 
		AddressApt=rs2("AddressApt")
		AddressCity=rs2("AddressCity")  
		AddressState=rs2("AddressState")    
		AddressZip=rs2("AddressZip") 
		AddressCountry=rs2("AddressCountry")    
   end if 

  rs2.close
end if 






	Query =  "INSERT INTO Registration(Status, EventID, PeopleID, Quantity, ServiceDescription, RegistrationDateTime )" 
	Query =  Query & " Values ('Paid', " & EventID  & ", " & PeopleID  &  ", " &  RegisteredQTY  &  ", 'General Registration'," & "'" & Now & "' )" 
		
Conn.Execute(Query) 

	Query =  "INSERT INTO RegistrationTemp(Status, EventID, PeopleID, Quantity, ServiceDescription, RegistrationDateTime )" 
	Query =  Query & " Values ('Paid', " & EventID  & ", " & PeopleID  &  ", " &  RegisteredQTY  &  ", 'General Registration'," & "'" & Now & "' )" 
		
Conn.Execute(Query) 


	Query =  "INSERT INTO OrderssetupEvents (Payment_status, EventID, PeopleID, Payer_email, address_city, address_country , address_name,  address_state, address_street, address_postcode, first_name, last_name, DateAdded)"
Query =  Query & " Values ('Completed', " & EventID  & ", " & PeopleID  &  ", '" &  PeopleEmail  &  "', '" & AddressCity &  "' , '" & AddressCountry &  "', '" & Owners &  "' , '" & AddressState &  "' , '" & AddressStreet &  "' , '" & AddressZip &  "' , '" & PeopleFirstName &  "' , '" & PeoplelastName & "' ,'" & Now & "' )" 
		
Conn.Execute(Query) 


 %>
<%  

  sql = "select * from EventPageLayout where PageName = 'Event Home' and EventID=" & EventID
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
        PageLayoutID = rs("PageLayoutID")
      end if
  rs.close  
  
  
 sql = "select * from EventPageLayout2 where BlockNum = 1 and PageLayoutID = " & PageLayoutID & ";"
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
        EventDescription = rs("PageText")
      end if
  rs.close  
 
 
response.Redirect("RegisterFreeSingleUserConfirmation.asp?PeopleID=" & PeopleID )  
  %>


 <!--#Include file="EventFooter.asp"--> 

</BODY>
</HTML>
