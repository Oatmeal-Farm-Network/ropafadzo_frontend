<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<meta http-equiv="Content-Language" content="en-us">
<title>Create Account - Andresen Events Online Event Registration</title>
<meta name="Title" content="Create Account - Andresen Events Online Event Registration">
<meta name="description" content="Create your account at Andresen Events - Online Event Registration." >
<meta name="keywords" content="Create Account,
Sign up,
Signup,
Event Registration,
Online Event Registration">
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="author" content="The Andresen Goup" >
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Online Event Registration" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">


<SCRIPT LANGUAGE="JavaScript">
function verify() {
var themessage = "Please fill out the following fields: \r";
if (document.form.PeopleFirstName.value=="") {
themessage = themessage + " - Registrant First Name \r";
}
if (document.form.PeopleEmail.value=="") {
themessage = themessage + " - Registrant E-mail \r";
}

if (document.form.password.value=="") {
themessage = themessage + " - Password \r";
}

if (document.form.confirm.value=="") {
themessage = themessage + " - Confirm Email \r";
}

 if(document.form.password.value != document.form.confirm.value) {
	themessage = themessage + " -Please check your password; the confirmation entry does not match. \r";

}
if (document.form.PeopleEmail.value != document.form.ConfirmEmail.value) {
    themessage = themessage + " -Please check your email address; the confirmation entry does not match. \r";

}

//alert if fields are empty and cancel form submit
if (themessage == "Please fill out the following fields: \r") {
document.form.submit();
}
else {
alert(themessage);
return false;
   }
}
//  End -->
</script>

<% 
ReturnFileName = Request.querystring("ReturnFileName") 
ReturnEventID = Request.querystring("ReturnEventID") 
Update = Request.querystring("Update") 

PeopleID = request.querystring("PeopleID")
Message = request.querystring("Message")

if len(PeopleID)> 0 then 
	sql = "select Address.*, Websites.*, People.* from Address, Websites, People where People.AddressID = Address.AddressID and People.WebsitesID = Websites.WebsitesID and PeopleID = " & PeopleID & ""
	'response.write(sql)
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	If Not rs.eof Then
		PeopleFirstName  =rs("PeopleFirstName") 
		PeopleLastName  =rs("PeopleLastName") 
		PeopleTitleID =rs("PeopleTitleID") 
		PeopleWebsite =rs("Website") 
		PeopleEmail =rs("PeopleEmail") 
		password =rs("PeoplePassword") 
		AddressStreet = rs("AddressStreet") 
		AddressApt = rs("AddressApt") 
		AddressCity  = rs("AddressCity")
		AddressState  = rs("AddressState")
		AddressZip  = rs("AddressZip")
		PeoplePhone  = rs("PeoplePhone")
		PeopleCell  = rs("PeopleCell")
		PeopleFax  = rs("Peoplefax")
	End If 
	rs.close

	if len(PeopleTitleID) > 0 then 
		sql = "select PeopleTitle from PeopleTitleLookup where PeopleTitleID = " & PeopleTitleID & ""
		'response.write(sql)
		Set rs = Server.CreateObject("ADODB.Recordset")
	    rs.Open sql, conn, 3, 3   
		ExistingEvent = False
		If Not rs.eof Then
			PeopleTitle = rs("PeopleTitle")
		end if 
	end if
end if
%>

</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<!--#Include file="Header.asp"-->
<br />
 <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%= screenwidth %>"><tr><td class = "roundedtop" align = "left" >
		<h1>Create Your Account</h1>
        </td></tr>
        <tr><td class = "roundedBottom">
        
<form  name=form method="post" action="SetupAccountStep2.asp?ReturnFileName=<%=ReturnFileName%>&ReturnEventID=<%=ReturnEventID%>">
<table border = "0" width = "<%= screenwidth -35 %>" align = "center"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=5>
	
	<tr>
		<td class = "body2" colspan = "2" align = "center">
				Please enter your information below: (* Indicates Required Fields)
<% if len(Message) > 1 then %><br>
<font color = "red"><b><%=Message%></b></font>
<% end if %>
		</td>
	</tr>
	<tr>
		<td valign = "top">

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 " >
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

<tr>
				<td class = "body2" align = "right" WIDTH = "150">
					First Name:* &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
					<input name="PeopleFirstName" Value ="<%=PeopleFirstName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					Last Name:* &nbsp;
				</td>
				<td class = "body2" align = "left">
					<input name="PeopleLastName" Value ="<%=PeopleLastName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td  class = "body2" align = "right">
					Title: &nbsp;
				</td>
				<td class = "body2" align = "left"  >
					<select size="1" name="PeopleTitleID">
						
<% if len(PeopleTitle) > 0 then %>
	<option value= "<%=PeopleTitleID %>" selected><%=PeopleTitle %></option>
<% else %>
	<option value= "5">N/A</option>
<% end if %>
<% 
  sql = "select * from PeopleTitleLookup where not PeopleTitle = 'N/A'"
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.Open sql, conn, 3, 3   
  if not rs.eof then
  while not rs.eof %>
		<option value= "<%=rs("PeopleTitleID") %>"><%=rs("PeopleTitle") %></option>
  <% 
  rs.movenext
  wend 
end if %>
 </select>
    	</td>
	</tr>
<tr>
	<td class = "body2" align = "right">
			Your Website: &nbsp;
		</td>
		<td class = "body2" align = "left">
			http://<input name="PeopleWebsite" Value ="<%=PeopleWebsite%>"  size = "30" maxlength = "61">
		</td>
	</tr>
	<tr>
		<td   class = "body2" align = "right">
			Email:* &nbsp;
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="PeopleEmail"  size = "30" value = "<%=PeopleEmail%>">
		</td>
</tr>
<tr>
		<td   class = "body2" align = "right">
			Confirm Email:* &nbsp;
		</td>
		<td  align = "left" valign = "top" class = "body2">
			<input name="ConfirmEmail"  size = "30" value = "<%=PeopleEmail%>">
		</td>
</tr>
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>
	<tr>
	<td class = "body2" align = "right" WIDTH = "150">Password:* &nbsp;</td>
	<td WIDTH = "300" align = "left"><label><input name="password" type="password" value="<%=password%>" maxlength = 12 ></label></td>
	</tr>
	<tr>
	<td class = "body2" align = "right">Confirm Password:* &nbsp;</td>
	<td align = "left" ><label><input name="confirm" type="password" value="<%=password%>"  maxlength = 12 ></label></td>
	</tr>
	<tr rowspan = "2">
	<td class = "body2" colspan = "2" align = "center">
		Password must be 5-12 characters long.
	</td>
	</tr>

</table>

</td>
<% if screenwidth < 900 then %>
</tr>
<tr>
<td width = "100%" valign = "Top">
<% else %>
<td width = "50%" valign = "Top">
<% end if %>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 " width = "100%">
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>

<tr>
						  <td   class = "body2" align = "right" WIDTH = "150">
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
							<td align = "left"  valign = "top" class = "body2">
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
	</table>

	</td>
</tr>
</table>
<table width = "100%"  align = "center" " border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<tr><td   class = "body">
	<% if AISubscription  = "True" then %> 
 	    <input type="checkbox" name="AISubscription" value="True" checked>
 	 	<% else %>
 	 	    <input type="checkbox" name="AISubscription" value="False" >
 	 	<% end if %>

Would you also like your account setup with Livestock Of America(<a href="http://www.LivestockOfAmerica.com" class = "body" target="blank">LivestockOfAmerica.com</a>)?<br />
<input name="PeopleID" type = "hidden"  value = "<%=PeopleID%>">
<input name="Update"  type= "hidden" value = "<%=Update%>">
<center>	<% if len(PeopleID)>0 then %>
		<input type=button value="Update Your Account" class = "regsubmit2" onclick="verify();">
	<% else %>
	<input type=button value="Create Your Account"  onclick="verify();" class = "regsubmit2">
    <% end if %></center>
</td></tr>
<tr>
		<td class ="body2" valign = "top" colspan = "2" >
			<br>
		</td>
	</tr>


</table>

	</form>
<br>
</td>
</tr>
</table>

<br><br>

<!--#Include virtual="Footer.asp"--> </body>
</HTML>