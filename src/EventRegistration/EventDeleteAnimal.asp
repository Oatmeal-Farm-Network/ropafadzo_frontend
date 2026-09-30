<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Delete Animal" 
PageLink = "EventDeleteAnimal.asp" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<title><%= EventName %> at Andresen Events - Event Registration</title>
<meta name="Title" content="<%= EventName %> at Andresen Events - Event Registration">
<meta name="description" content="<%= EventDescription %> " >
<META name="keywords" content="Alpaca events, livestock events, events,Alpaca event registration, Livestock event registration, online registration, event registration, online event registration, event registration software, event registration online, online event registration software, event registration management software, event registration system, event management, registration software, event registration service, event registration services, easy online event registration, online event registration service, event registration website, event registration site, online event registration services,  PayPal, credit cards, online payments"> 
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpaca Events" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->
<!--#Include file="EventHeader.asp"-->


<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr><td class = "body" colspan = "2" ><br><h1>Delete an Animal</h1>
</td>
</tr>
  <tr><td class = "body"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
  <tr><td class = "body" colspan = "2" >To delete an animal's information simply select the animals name and push the button.<br> <b>But careful. Once an animal is deleted from your database, it's gone!</b><br><br></td>
</tr>
</table>

<%  
dim aID(40000)
dim aName(40000)

	sql2 = "select AnimalID, AnimalsName from Animal where PeopleID = " & PeopleID & " order by AnimalsName"
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof  
		aID(acounter) = rs2("AnimalID")
		aName(acounter) = rs2("AnimalsName")
		NumAnimals = rs2.recordcount
		acounter = acounter +1
		rs2.movenext
	Wend		
	
		rs2.close
		set rs2=nothing
		set conn = nothing
%>


<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
	<tr>
		<td>	
		 <% if NumAnimals > 0 then %>
			<form action= 'EventDeleteAnimalConfirm.asp' method = "post">
			   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				 <td>
	
					<b>Animal's Name</b><br>
					<select size="1" name="AnimalID">
					<option name = "AID0" value= "" selected></option>
					<% count = 1
						while count < acounter
						response.write(count)
					%>
						<option name = "AID1" value="<%=aID(count)%>">
							<%=aName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
				<td>
					<br>
					<input type=submit value = "Delete" class = "regsubmit2" >
				</td>
			  </tr>
		    </table>
		  </form>
		 <% else %>
		 Currently you do not have animals listed in our system.<br />
		 <br><a  class = "body" href="EventRegister.asp">Click here to return to the registration.</a>
		 <% end if %>
		</td>
	</tr>
</table>

<!--#Include virtual="/Administration/Footer.asp"--> </Body>
</HTML>