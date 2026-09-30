<%@ Language="VBScript" %> 
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Add Registration</title>
<meta http-equiv="Content-Language" content="en-us">
</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "AddRegistration" %>
<!--#Include file="OverviewHeader.asp"-->
<!--#Include file="Scripts.asp"--> 

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=textwidth%>" ><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Add a Registration - Step 1 Select/Add a User 
			Account</div></H1>
        </td></tr>
        <tr><td class = "roundedBottom" align = "center">
<br />

<table border = "0" width = "100%">
<tr>
<td valign = "top" class = "body" align = "left">
To get started first one of the followig:
   <ul><li><a href = "#Existing" class = "body">Select an Existing Events</a></li>
   <li><a href = "#NewAccount" class = "body">Create a New Account</a></li>
   </ul>
</td>
</tr>
<tr>
<td align = "center" valign = "top">



	

	<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" width = "<%=textwidth%>">
	<tr>
		<td class ="body2" valign = "top" width = "100%" bgcolor = "<%=SecondaryColor %>" align = "center">

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "100%" ><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Existing Accounts</div></H1>
        </td></tr>
        <tr><td class = "roundedBottom" align = "center">

	
			&nbsp;&nbsp;Select an account from the list below:<br /><br />
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" width = "<%=textwidth%>">


<%  sql = "select distinct People.*, address.* from People, Address, OrdersSetupEvents, Instructors, Judges where People.AddressID = Address.AddressID and not (Deleted = true) and OrdersSetupEvents.EventID=" & eventID & " order by PeopleLastName "

sql = "select * from People, address where accesslevel > 0 and length(peopleLastname) > 1 and length(PeopleFirstName) > 1 and People.AddressID = Address.AddressID and not(Deleted = true) order by PeopleLastName "

order = "Even"

		Set rs = Server.CreateObject("ADODB.Recordset")
	    rs.Open sql, conn, 3, 3  
	    if rs.eof then 
	       else
	    while not rs.eof 
	    ListPeopleID= rs("PeopleID")
	    ListPeopleFirstName = rs("PeopleFirstName")
	    ListPeopleLastName = rs("PeopleLastName")
	    ListPeopleEmail = rs("PeopleEmail")
        ListPeopleFirstName = rs("PeopleFirstName")
        ListPeopleLastName = rs("PeopleLastName")


'UserQTYExtraTables = rs("UserQTYExtraTables")
	'UserID = rs("UserID")
	 UserBusinessID  = rs("BusinessID")
	 BusinessID  = rs("BusinessID")
	UserAddressID = rs("AddressID")
	UserWebsitesID = rs("WebsitesID")
	'UserStallName = rs("UserStallName")
	'UserStallDescription = rs("UserStallDescription")
	'UserStallName = rs("UserStallName")
	'UserPaidAmount = rs("UserPaidAmount")
	'UserPaidAmountMonth  = rs("UserPaidAmountMonth")
	'UserPaidAmountDay = rs("UserPaidAmountDay")
	'UserPaidAmountYear = rs("UserPaidAmountYear")

	'UserStallPrice = rs("UserStallPrice")
	'UserBoothQTY= rs("UserBoothQTY")
	'SpecialRequests= rs("SpecialRequests")
	
 ListBusinessname = ""
	'PeopleID = rs("PeopleID")
if len(BusinessID) > 0 then	
sql3 = "select * from Business  where BusinessID = " & UserBusinessID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	 ListBusinessName = rs3("BusinessName")

end if 	
rs3.close
end if	

BusinessAddress = ""
	BusinessApt = ""
	BusinessCity = ""
	BusinessState = ""
	BusinessCountry = ""
BusinessZip =""

if len(UserAddressID) > 0 then	
sql3 = "select * from Address where AddressID = " & UserAddressID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	BusinessAddress = rs3("AddressStreet")
	BusinessApt = rs3("AddressApt")
	BusinessCity = rs3("AddressCity")
	BusinessState = rs3("AddressState")
	BusinessCountry = rs3("Addresscountry")
BusinessZip = rs3("AddressZip")
end if 	
rs3.close
end if	


Website =""
if len(UserWebsitesID) > 0 then	
sql3 = "select * from Websites where WebsitesID = " & UserWebsitesID 
    Set rs3 = Server.CreateObject("ADODB.Recordset")
    rs3.Open sql3, conn, 3, 3   
	if  not rs3.eof then 

	Website = rs3("Website")
end if 	
rs3.close
end if
	      
if Order = "Event" then	
   Order = "Odd"    %>	
<tr >
<% else 
    Order = "Event" %>
<tr bgcolor = "#eeeeee">
<% end if %>
<td class = "body" height = "20">&nbsp;<a href = "AddRegistrationStep2.asp?CurrentPeopleID=<%=  ListPeopleID %>" class = "body"><%= ListPeopleLastName %>, <%= ListPeopleFirstName %></a></td>
<td class = "body" ><a href = "AddRegistrationStep2.asp?CurrentPeopleID=<%=  ListPeopleID %>" class = "body"><%=  ListBusinessName %></a></td>
<td class = "body" ><a href = "AddRegistrationStep2.asp?CurrentPeopleID=<%=  ListPeopleID %>" class = "body"><%= ListPeopleEmail %></a></td>
</tr>
<% rs.movenext
wend
rs.close 
end if%>
</table>



</td></tr>
</table>
</td></tr>
</table>

<br /><br />
<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "100%" ><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Create a New Account</div></H1>
        </td></tr>
        <tr><td class = "roundedBottom" align = "center">
<tr><td colspan = "2" class = "body" background ='images/Background650.jpg'>	
<table  border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"  width = "630" >
<tr>
		<td class ="body2" valign = "top" bgcolor = "<%=SecondaryColor %>">
		<form action= 'AddRegistration.asp' method = "post">
		<blockquote>
		<% if len(NewPeopleID) > 0 then %>
				If you wish you can update your account information below:<br />
		<% else %>
		<br /><br /><H2>New Account</H2>
			Fill out the form below to create an Andresen Events account:<br />
		<% end if  %>
			 (* Indicates Required Fields)
<% if len(Message) > 1 then %><br>
<font color = "red"><b><%=Message%></b></font>
<% end if %>

<table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top" width = "500">
	<tr>
		<td class ="body2" valign = "top" colspan = "2" >
	
		<% if (AccountCreated = True) and not(AccountUpdated = True) then %>

		
		<% end if		
		if not(AccountCreated = True) and not(AccountUpdated = True) then
	
		 if (ProceedToAdd = False and CreateAccount="True")  then%>
		 <%  if NotInDB = False or len(PeopleFirstName) < 1 or len(PeopleLastName) < 1 or  len(PeopleEmail) < 5 or len(Password) < 6 or not (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))) or not (trim(Password) = trim(confirmPassword)) then %>
	
		<font color = "brown"><b>The Account Was Not Created.</b><br />
		Please resolve the following issues and reselect the "Create Account" 
		button:
		<ul><%  if NotInDB = False then %>
		  <li>There already is an account with that E-Mail address. Please 
		  select the existing account or use a different E-Mail address.</li>
		<% end if %>
		 <%  if len(PeopleFirstName) < 1 then %>
		  <li>Please enter a first name.</li>
		<% end if %>
		<%  if len(PeopleLastName) < 1 then %>
		  <li>Please enter a last name.</li>
		<% end if %>
		<%  if len(PeopleEmail) < 5 then %>
		  <li>Please enter an valid E-Mail address.</li>
		<% end if %>
			
		<%  if len(Password) < 6 then %>
		  <li>Please enter a valid password. Passwords must be at least 5 
		  characters long.</li>
		<% end if %>
		 <%  if not (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))) then %>
		     <li>Please enter matching E-Mail addresses.</li>
		 <% end if %>
		<%  if not (trim(Password) = trim(confirmPassword)) then %>
		     <li>Please enter a matching passwords.</li>
		 <% end if %>

		</ul>
       
		</font>	
		<% end if  %>
		<% end if  
		end if
		
		
		if not(AccountUpdated = True) then
		
		 if  (ProceedToUpdate = False and UpdateAccount = "True") then%>
		  <%  if len(PeopleFirstName) < 1 or  len(PeopleLastName) < 1 or len(PeopleEmail) < 5 or len(Password) < 6 or (not (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))))  or (not (trim(Password) = trim(confirmPassword))) then %>
		 
		<font color = "brown"><b>Your Account Was Not Updated.</b><br />
		Please resolve the following issues and reselect the "Update Your 
		Account" button:
		<ul>
		 <%  if len(PeopleFirstName) < 1 then %>
		  <li>Please enter a first name.</li>
		<% end if %>
		<%  if len(PeopleLastName) < 1 then %>
		  <li>Please enter a last name.</li>
		<% end if %>
		<%  if len(PeopleEmail) < 5 then %>
		  <li>Please enter an valid E-Mail address.</li>
		<% end if %>
			
		<%  if len(Password) < 6 then %>
		  <li>Please enter a valid password. Passwords must be at least 5 
		  characters long.</li>
		<% end if %>
		 <%  if not (trim(ucase(peopleEmail)) = trim(ucase(confirmEmail))) then %>
		     <li>Please enter matching E-Mail addresses.</li>
		 <% end if %>
		<%  if not (trim(Password) = trim(confirmPassword)) then %>
		     <li>Please enter a matching passwords.</li>
		 <% end if %>

		</ul>
       
		</font>	
		<% end if  %>
		<% end if  %>
		
				<% end if  %>
		
			<% if AccountCreated = True and CreateAccount="True" then%>
					<b>The Account was successfully created.</b><br />
			<% end if %>
			
		<%
		 if AccountUpdated = "True" and UpdateAccount="True" then%>
			<b>Your Account Was Updated.</b>
			<% end if %>
			
			
	<br />
    	</td>
</tr></table>


<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "500">
<tr>
				<td class = "body2" align = "right" >
				 <%  if len(PeopleFirstName) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %><font color = "brown"><% end if %>
				 First Name:* &nbsp;<%  if len(PeopleFirstName) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %></font><% end if %>
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
					<input name="PeopleFirstName" Value ="<%=PeopleFirstName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					<%  if len(PeopleLastName) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %><font color = "brown"><% end if %>
					Last Name:* &nbsp;<%  if len(PeopleLastName) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %></font ><% end if %>
				</td>
				<td class = "body2" align = "left">
					<input name="PeopleLastName" Value ="<%=PeopleLastName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td  class = "body2" align = "right">
					Title: &nbsp;
				</td>
				<td class = "body2"  align = "left" >
					<select size="1" name="PeopleTitleID">
						
<% if len(PeopleTitle) > 0 then %>
	<option value= "<%=PeopleTitleID %>" selected><%=PeopleTitle %></option>
<% else %>
	<option value= "5">N/A</option>
<% end if %>
<% 
  sql = "select * from PeopleTitleLookup where not PeopleTitle = 'N/A'"
  Set rsp = Server.CreateObject("ADODB.Recordset")
  rsp.Open sql, conn, 3, 3   
  if not rsp.eof then
  while not rsp.eof %>
		<option value= "<%=rsp("PeopleTitleID") %>"><%=rsp("PeopleTitle") %></option>
  <% 
  rsp.movenext
  wend 
end if 
rsp.close %>
 </select>
    	</td>
	</tr>
	<tr>
	<td class = "body2" align = "right">
			Business Name: &nbsp;
		</td>
		<td class = "body2" align = "left">
			<input name="BusinessName" Value ="<%=BusinessName%>"  size = "30" maxlength = "61">
		</td>
	</tr>
<tr>
	<td class = "body2" align = "right">
			Website: &nbsp;
		</td>
		<td class = "body2" align = "left">
			http://<input name="PeopleWebsite" Value ="<%=PeopleWebsite%>"  size = "30" maxlength = "61">
		</td>
	</tr>
	

<tr>
						  <td   class = "body2" align = "right">
								Mailing Address: &nbsp;
							</td>

							<td  align = "left" valign = "top" class = "body2">
								<input name="AddressStreet"  size = "30" value = "<%=AddressStreet%>">
							</td>
						</tr>
						<tr>
						<td   class = "body2"  align = "right">
								Apartment / Suite: &nbsp;
						</td>
						<td  valign = "top" class = "body2" align = "left">
								<input name="AddressApt"  size = "30" value = "<%=AddressApt%>">
							</td>
						</tr>
						<tr>
							<td   class = "body2" align = "right">
								City: &nbsp;
							</td>
							<td  valign = "top" class = "body2" align = "left">
								<input name="AddressCity"  size = "30" value = "<%=AddressCity%>">
							</td>
						</tr>
						<tr>
							<td  align = "right" class = "body2">
								State/ Provence: &nbsp;
							</td>
							<td  align = "left" valign = "top" class = "body2">
					
							<select size="1" name="AddressState">
							<% If Len(AddressState) > 0 then%>
								<option value="<%=AddressState%>" selected><%=AddressState%></option>
							<% Else %>
								<option value="" selected>-----</option>
							<% End If %>
					<option value="AL">AL</option>
					<option  value="AK">AK</option>
					<option  value="AZ">AZ</option>
					<option  value="AR">AR</option>
					<option  value="CA">CA</option>
					<option  value="CO">CO</option>
					<option  value="CT">CT</option>
					<option  value="DE">DE</option>
					<option  value="DC">DC</option>
					<option  value="FL">FL</option>
					<option  value="GA">GA</option>
					<option  value="HI">HI</option>
					<option  value="ID">ID</option>
					<option  value="IL">IL</option>
					<option  value="IN">IN</option>
					<option  value="IA">IA</option>
					<option  value="KS">KS</option>
					<option  value="KY">KY</option>
					<option  value="LA">LA</option>
					<option  value="ME">ME</option>
					<option  value="MD">MD</option>
					<option  value="MA">MA</option>
					<option  value="MI">MI</option>
					<option  value="MN">MN</option>
					<option  value="MS">MS</option>
					<option  value="MO">MO</option>
					<option  value="MT">MT</option>
					<option  value="NE">NE</option>
					<option  value="NV">NV</option>
					<option  value="NH">NH</option>
					<option  value="NJ">NJ</option>
					<option  value="NM">NM</option>
					<option  value="NY">NY</option>
					<option  value="NC">NC</option>
					<option  value="ND">ND</option>
					<option  value="OH">OH</option>
					<option  value="OK">OK</option>
					<option  value="OR">OR</option>
					<option  value="PA">PA</option>
					<option  value="RI">RI</option>
					<option  value="SC">SC</option>
					<option  value="SD">SD</option>
					<option  value="TN">TN</option>
					<option  value="TX">TX</option>
					<option  value="UT">UT</option>
					<option  value="VT">VT</option>
					<option  value="VA">VA</option>
					<option  value="WA">WA</option>
					<option  value="WV">WV</option>
					<option  value="WI">WI</option>
					<option  value="WY">WY</option>
					<option  value=""></option>
					<option  value="ON">ON</option>
					<option  value="QC">QC</option>
					<option  value="BC">BC</option>
					<option  value="AB">AB</option>
					<option  value="MB">MB</option>
					<option  value="SK">SK</option>
					<option  value="NS">NS</option>
					<option  value="NB">NB</option>
					<option  value="NL">NL</option>
					<option  value="PE">PE</option>
					<option  value="NT">NT</option>
					<option  value="YK">YK</option>
					<option  value="NU">NU</option>

				</select>
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Postal Code: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="AddressZip"  size = "8" value = "<%=AddressZip%>">
			</td>
		</tr>
		<tr>
			<td  align = "right" class = "body2">
				<small>Country: </small>	
			</td>
			<td  align = "left" valign = "top" class = "body2">
					
				<select size="1" name="BusinessCountry">
					<option value="USA" selected>USA</option>
					<option value="Canada">Canada</option>
				</select>
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Phone: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="PeoplePhone"  size = "30" value = "<%=PeoplePhone%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Cell: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="PeopleCell"  size = "30" value = "<%=PeopleCell%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Fax: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="PeopleFax"  size = "30" value = "<%=PeopleFax%>">
			</td>
		</tr>
		<tr>
		<td   class = "body2" align = "right">
			<%  if ((len(PeopleEmail) < 1 or NotInDB = False ) and CreateAccount = "True") or (len(PeopleEmail) < 1 and UpdateAccount = "True") then %><font color = "brown"><% end if %>
			Email:* &nbsp;<%  if ((len(PeopleEmail) < 1 or NotInDB = False ) and CreateAccount = "True") or (len(PeopleEmail) < 1 and UpdateAccount = "True") then %></font><% end if %>
	
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="PeopleEmail"  size = "30" value = "<%=PeopleEmail%>">
		</td>
	</tr>
		<tr>
		<td   class = "body2" align = "right">
			<%  if ((len(PeopleEmail) < 1 or NotInDB = False ) and CreateAccount = "True") or (len(PeopleEmail) < 1 and UpdateAccount = "True") then %><font color = "brown"><% end if %>
			Confirm Email:* &nbsp;<%  if ((len(PeopleEmail) < 1 or NotInDB = False ) and CreateAccount = "True") or (len(PeopleEmail) < 1 and UpdateAccount = "True") then %></font><% end if %>
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="confirmemail"  size = "30" value = "<%=confirmEmail%>">
		</td>
	</tr>
	<tr>
	<td class = "body2" align = "right" ><%  if len(password) < 6 and (CreateAccount = "True" or UpdateAccount = "True") then %><font color = "brown"><% end if %>
	Password:* &nbsp;<%  if len(password) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %></font ><% end if %></td>
	<td WIDTH = "300"><label><input name="password" type="password" value="<%=password%>" maxlength = 12 ></label></td>
	</tr>
	<tr>
	<td class = "body2" align = "right"><%  if len(password) < 6 and (CreateAccount = "True" or UpdateAccount = "True") then %><font color = "brown"><% end if %>
	Confirm Password:* &nbsp;<%  if len(password) < 1 and (CreateAccount = "True" or UpdateAccount = "True") then %></font ><% end if %></td>
	<td><label><input name="confirmpassword" type="password" value="<%=password%>"  maxlength = 12 ></label></td>
	</tr>
	<tr rowspan = "2">
	<td class = "body2" colspan = "2" align = "center">
		Password must be 5-12 characters long.
	</td>
	</tr>
	</table>
	
			<% CreateAccount = "False" 
UpdateAccount= "False" %>
		<% if len(NewPeopleID)>0 then %>
		<input type= "hidden" name="UpdateAccount" value= "True" >
		<input type= "hidden" name="CreateAccount" value= "False" >
	<% else %>
	<input type= "hidden" name="CreateAccount" value= "True" >
			<input type= "hidden" name="UpdateAccount" value= "False" >
    <% end if %>
			

	<center><% if len(NewPeopleID)>0 then %>
		<input type=submit value="Update Account" class = "regsubmit2" onclick="verify();">
	<% else %>
	<input type=submit value="Create Account"   class = "regsubmit2">
    <% end if %>
</center>	</form>	
		</td>
</tr>
</table>





<tr><td height = "15" background ='images/Footer650.jpg'><img src = "images/px.gif" height = "1" width = "1" /></td></tr>
</table>
</td></tr></table>
<a name = "NewAccount"></a>
<br>
</td></tr></table>
 <br> <br> <br>
<!--#Include file="Footer.asp"-->
</body>
</html>

