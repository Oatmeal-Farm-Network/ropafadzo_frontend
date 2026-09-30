
<%'************************************************************************************************
  ' START USER LOOKUP
  '************************************************************************************************

ExistingPeopleID= Request.Form("ExistingPeopleID")



sql2 = "select * from People where peopleID = " & ExistingPeopleID & " order by PeopleLastName Desc"

if len(ExistingPeopleID) > 0 then
'response.write("sql2= " & sql2)
    Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
	
	if Not rs2.eof then 
	BusinerssID = rs2("BusinessID")
	PeopleID = rs2("PeopleID")
	PeopleFirstName = rs2("PeopleFirstName")
	PeopleLastName= rs2("PeopleLastName")
	PeopleEmail= rs2("PeopleEmail")
	PeoplePhone= rs2("PeoplePhone")
	PeopleCell= rs2("PeopleCell")
	PeopleFax= rs2("PeopleFax")
	AddressID = rs2("AddressID")
	WebsitesID = rs2("WebsitesID")
		
	if len(AddressID) > 0 then
		sql3 = "select * from Address where AddressID = " & AddressID & " order by AddressID Desc"
		 Set rs3 = Server.CreateObject("ADODB.Recordset")
   		 rs3.Open sql3, conn, 3, 3   


		AddressID = rs3("AddressID")
		AddressStreet= rs3("AddressStreet")
		AddressApt= rs3("AddressApt")
		AddressCity= rs3("AddressCity")
		AddressState= rs3("AddressState")
		AddressState= rs3("AddressState")
		AddressZip= rs3("AddressZip")
		rs3.close
	end if	
	
	BusinessID = rs2("BusinessID")
		if len(BusinessID) > 0 then
   			sqlb = "select BusinessName from Business where  BusinessID = " & BusinessID
   			Set rsb = Server.CreateObject("ADODB.Recordset")
   			rsb.Open sqlb, conn, 3, 3   
			if not rsb.eof then
				BusinessName = rsb("BusinessName")
   			end if
   			rsb.close
   		end if	

if len(WebsitesID) > 0 then
   			sqlb = "select Website from Websites where  WebsitesID = " & WebsitesID
   			Set rsb = Server.CreateObject("ADODB.Recordset")
   			rsb.Open sqlb, conn, 3, 3   
			if not rsb.eof then
				Website = rsb("Website")
   			end if
   			rsb.close
   		end if	


end if

rs2.close
end if


dim PeopleIDArray(1000000)
dim PeopleArray(1000000)
 x = 1
sql = "select distinct BusinessID, PeopleID, PeopleLastName, PeopleFirstName from People  order by PeopleLastName "
'response.write(sql)
	
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
if not rs.eof then
  while not rs.eof 
	BusinessID = rs("BusinessID")
		if len(businessID) > 0 then
   			sqlb = "select BusinessName from Business where  BusinessID = " & BusinessID
   			Set rsb = Server.CreateObject("ADODB.Recordset")
   			rsb.Open sqlb, conn, 3, 3   
			if not rsb.eof then
				tempBusinessName = rsb("BusinessName")
   			end if
   			rsb.close
   		else 
   		tempBusinessName = ""

   		end if	
	'response.write("BusinessID=" & BusinessID)
		
	PeopleIDArray(x) = rs("PeopleID")
	PeopleArray(x) = rs("PeopleLastname") & " , " & rs("PeopleFirstname")
	if len(tempBusinessName) > 0 then
		PeopleArray(x) = PeopleArray(x) & " - " & tempBusinessName
	end if 
	
x = x + 1
rs.movenext
wend
end if
rs.close
totalcount = x
x = 1

%>
<form  name="PeopleDataForm" method="POST"  action="<%=currentpagename %>?EventID=<%=eventID %>" >
<table width = "900" border = "0"  marginheight="0"  cellpadding=0 cellspacing=0 align = "center" >
	<tr>
	<td class = "body2"><br>
	Select an existing person from our database:


<select size="1" name="ExistingPeopleID" onchange="submit();">

<% if len(ExistingPeopleID) > 0 then %>
 	<option value="<%=ExistingPeopleID %>" ><%=PeoplelastName%> , <%=PeopleFirstName%> <% if len(BusinessName) > 0 then %> - <%=BusinessName%> <% end if %></option>
<% else %>
   <option value="" >----</option>

<% end if
 while x < totalcount %>
   <option value="<%=PeopleIDArray(x)%>" ><%=PeopleArray(x)%></option>


<% x = x + 1
wend
 %>
 

</select>
<br>
</td></tr>
<tr><td class = "body2" colspan  "3" bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr></table>
</form>



<%'************************************************************************************************
   ' END USER LOOKUP
  '************************************************************************************************
%>
