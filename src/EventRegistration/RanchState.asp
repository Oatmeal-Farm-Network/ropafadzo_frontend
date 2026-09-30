<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>


<!--#Include file="GlobalVariables.asp"-->

<% SetLocale("en-us") 

CustID = 2 

State=Request.QueryString("State")
if len(state) < 1 then
	response.redirect("AllStates.asp")
end if
Sort=request.form("Sort") 


conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(databasepath) & ";" & _
"User Id=;Password=;" '& _ 
     
sql = "SELECT * from States where StateAbbreviation =  '" & State & "'"
'response.write (sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
StateName = rs("StateName")
StateAbbreviation = rs("StateAbbreviation")
StateHeaderImage = rs("StateHeaderImage")
StateDescription = rs("StateDescription")
StateFlag = rs("StateFlag")
Statebird = rs("Statebird")
StateSeal = rs("StateSeal")
Weatherlink = rs("Weatherlink")
Nicknames = rs("Nicknames") 
Moto = rs("Moto")
StateDescription = rs("StateDescription")
str1 = StateDescription
str2 = vblf
If InStr(str1,str2) > 0 Then
	StateDescription= Replace(str1, str2 , "</br>")
End If  

str1 = StateDescription
str2 = vbtab
If InStr(str1,str2) > 0 Then
	StateDescription= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
End If  

Governor = rs("Governor")
Senator1 = rs("Senator1")
Senator2 = rs("Senator2")
Rep1 = rs("Rep1")
Rep2 = rs("Rep2")
Rep3 = rs("Rep3")
Rep4 = rs("Rep4")
Rep5 = rs("Rep5")
Rep6 = rs("Rep6")
Rep7 = rs("Rep7")
Rep8 = rs("Rep8")
Rep9 = rs("Rep9")
Rep10 = rs("Rep10")
Rep11 = rs("Rep11")
Rep12 = rs("Rep12")
Rep13 = rs("Rep13")
Rep14 = rs("Rep14")
Rep15 = rs("Rep15")
Rep16 = rs("Rep16")
Rep17 = rs("Rep17")
Rep18 = rs("Rep18")
Rep19 = rs("Rep19")
Rep20 = rs("Rep20")
Rep21 = rs("Rep21")
Rep22 = rs("Rep22")
Rep23 = rs("Rep23")
Rep24 = rs("Rep24")
Rep25 = rs("Rep25")
Rep26 = rs("Rep26")
Rep27 = rs("Rep27")
Rep28 = rs("Rep28")
Rep29 = rs("Rep29")
Rep30 = rs("Rep30")
Rep31 = rs("Rep31")
Rep32 = rs("Rep32")
Rep33 = rs("Rep33")
Rep34 = rs("Rep34")
Rep35 = rs("Rep35")
Rep36 = rs("Rep36")
Rep37 = rs("Rep37")
Rep38 = rs("Rep38")
Rep39 = rs("Rep39")
Rep40 = rs("Rep40")
Rep41 = rs("Rep41")
Rep42 = rs("Rep42")
Rep43 = rs("Rep43")
Rep44 = rs("Rep44")
Rep45 = rs("Rep45")
Rep46 = rs("Rep46")
Rep47 = rs("Rep47")
Rep48 = rs("Rep48")
Rep49 = rs("Rep49")
Rep50 = rs("Rep50")
Rep51 = rs("Rep51")
Rep52 = rs("Rep52")
Rep53 = rs("Rep53")
Rep54 = rs("Rep54")
Rep55 = rs("Rep55")
Rep56 = rs("Rep56")
Rep57 = rs("Rep57")
Rep58 = rs("Rep58")


rs.close

%>

<title><%=StateName %> Alpacas For Sale at Alpaca Infinity</title>
<META name="Title" content="">
<META name="description" content="<%=StateName %> Alpacas for sale at <%=StateName %> Farms / <%=StateName %> Alpaca Ranches. Find Alpacas For Sale, Stud Services, Alpaca Fiber (alpaca wool), and alpaca products for sale." />
<META name="keywords" content="<%=StateName %> alpaca farms, 
<%=StateName %> alpaca ranches, 
<%=StateName %> alpaca farms,
<%=StateName %> Alpacas for sale, 
<%=StateName %> Alpacas">
<meta name="robots" content="index,follow"/>
<meta name="rating" content="Safe for kids"/>
<meta name="revisit-after" content="1"/>
<meta name="Googlebot" content="index,follow"/>
<meta name="robots" content="All"/>

<link rel="shortcut icon" href="/infinityknot.ico" /> 
<link rel="icon" href="http://www.alpacainfinity.com/alpacachamps/infinityknot.ico" /> 

<meta name="subjects" content="<%=StateName %> Alpaca Ranches, <%=StateName %> Alpaca Farms,  <%=StateName %> Alpacas for Sale" />
<link rel="stylesheet" type="text/css" href="ARQstyle.css">






<!--#Include file = "RoundedStyle.asp"-->

</head>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">
	<% Sidemenu = True %>
	<!--#Include file="Header2.asp"-->
	<br>
<% If Len(StateHeaderImage) > 4 Then %>
	<img src = "images/<%=StateHeaderImage%>" alt = "<%=StateName %> Alpacas for Sale">
<% End If %>
<h1><%=StateName %> Alpaca Ranches</h1>



<table border = "0" width = "100%"  align = "center" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  >
  <tr>
   <td valign = "top" class = "body">The alpaca ranches below are all located in <%=Trim(StateName) %>, listed in aplabetical order:
<%
sql = "SELECT * from sfCustomers where accesslevel > 0 and custstate =  '" & State & "' order by custCompany"
'response.write (sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   
 
If rs.eof Then %><br><br>
	<center><b>We do not currently have any have any <%=StateName %> alpaca ranches / alpaca farms registered with Alpaca infinity.  </b><br></center>
			

<%  End if

While Not rs.eof 
    CustID = rs("CustID")
	Logo = rs("Logo")
	Weblink = rs("Weblink")
	custFirstName = rs("custFirstName")
	custMiddleInitial = rs("custMiddleInitial")
	custLastName = rs("custLastName")
	custCompany = rs("custCompany")
	custAddr1 = rs("custAddr1")
	custAddr2 = rs("custAddr2")
	custCity = rs("custCity")
	custState = rs("custState")
	custZip = rs("custZip")
	custCountry = rs("custCountry")
	custPhone = rs("custPhone")
	custphone2 = rs("custphone2")
	custFax = rs("custFax")
	custAccountID = rs("custAccountID")
	custEmail = rs("custEmail")
	'custRanchdescription = rs("custRanchdescription")
%>


<div class="container"> 
<b class="rtop"> 
  <b class="rs1"></b> <b class="rs2"></b> 
</b> 
<table border = "0" width = "400" height ="50" align = "center" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  >
	<tr>
		<td width = "83" align = "center" >
			<% if Len(Logo) > 2 Then %>
				<a href = "ranchhome.asp?CustID=<%=CustID%>" class = "body"><img src = "/Uploads/Logos/<%=Logo %>" border = "0" width = "80" alt = "<%=custState%> alpacas for Sale at <%=custCompany%> Alpaca Farm"></a>
			<% End If %>
		</td>
		<td class = "body">	<% If Len(custCompany) > 2 Then %>
				<b><%=custCompany%></b><br>
			<% End If %>
			<% If Len(custFirstName) > 2 Then %>
				<%=custFirstName%>  <br>
			<% End If %>
			<% If Len(custCity) > 2 Then %>
				<%=custCity%>, <%=custState%> <br>
			<% End If %>

			<center><a href = "Ranchhome.asp?CustID=<%=CustID%>" class = "menu2" align = "center">Learn More About <%=custCompany%>.</big></a></center>
		</td>
	</tr>
</table>
<b class="rbottom"> 
   <b class="rs2"></b> <b class="rs1"></b> 
</b> 
</div><% 
   rs.movenext
	wend

 %></td>
<td class = "body" width = "200" valign = "top">
<br><br>
<div class="container"> 
<b class="rtop"> 
  <b class="rs1"></b> <b class="rs2"></b> 
</b> 
<table border = "0" width = "195" height = "400" align = "center" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center">
	<tr>
		<td width = "195" align = "left" valign = "top">
		<center><img src = "/uploads/states/<%=StateSeal %>" border = "0" align = "center" width = "100" alt = "<%=custState%> State Seal"></center><br>
<center><big><%=Trim(StateName) %></big></center><br>
Abbreviation: <%=StateAbbreviation %><br>
Nicknames:<br>
<center><i><%=Nicknames%></i></center><br>
Motto: <center><i><%=Moto%></i></center><br><br>
<center><img src = "/uploads/states/<%=StateFlag %>" border = "0" align = "center" width = "100" alt = "<%=custState%> State Flag"></center>

<small>


Governor: <br>
<% if len(Governor)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Governor%><br>
<% End If %>

U.S. Senators:<br>
<% if len(Senator1)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Senator1%><br>
<% End If %>

<% if len(Senator2)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Senator2%><br>
<% End If %>

U.S. House Delegates:<br>
<% if len(Rep1)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep1%><br>
<% End If %>

<% if len(Rep2)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep2%><br>
<% End If %>
<% if len(Rep3)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep3%><br>
<% End If %>

<% if len(Rep4)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep4%><br>
<% End If %>

<% if len(Rep5)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep5%><br>
<% End If %>
<% if len(Rep6)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep6%><br>
<% End If %>
<% if len(Rep7)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep7%><br>
<% End If %>
<% if len(Rep8)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep8%><br>
<% End If %>
<% if len(Rep9)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep9%><br>
<% End If %>
<% if len(Rep10)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep10%><br>
<% End If %>
<% if len(Rep11)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep11%><br>
<% End If %>
<% if len(Rep12)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep12%><br>
<% End If %>
<% if len(Rep13)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep13%><br>
<% End If %>
<% if len(Rep14)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep14%><br>
<% End If %>

<% if len(Rep15)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep15%><br>
<% End If %>

<% if len(Rep16)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep16%><br>
<% End If %>

<% if len(Rep17)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep17%><br>
<% End If %>


<% if len(Rep18)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep18%><br>
<% End If %>

<% if len(Rep19)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep19%><br>
<% End If %>

<% if len(Rep20)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep20%><br>
<% End If %>

<% if len(Rep21)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep21%><br>
<% End If %>

<% if len(Rep22)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep22%><br>
<% End If %>

<% if len(Rep23)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep23%><br>
<% End If %>

<% if len(Rep24)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep24%><br>
<% End If %>

<% if len(Rep25)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep25%><br>
<% End If %>


<% if len(Rep26)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep26%><br>
<% End If %>


<% if len(Rep27)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep27%><br>
<% End If %>


<% if len(Rep28)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep28%><br>
<% End If %>


<% if len(Rep29)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep29%><br>
<% End If %>


<% if len(Rep3)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep3%><br>
<% End If %>

<% if len(Rep31)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep31%><br>
<% End If %>

<% if len(Rep32)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep32%><br>
<% End If %>

<% if len(Rep33)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep33%><br>
<% End If %>

<% if len(Rep34)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep34%><br>
<% End If %>

<% if len(Rep35)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep35%><br>
<% End If %>


<% if len(Rep36)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep36%><br>
<% End If %>


<% if len(Rep37)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep37%><br>
<% End If %>

<% if len(Rep38)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep38%><br>
<% End If %>

<% if len(Rep39)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep39%><br>
<% End If %>


<% if len(Rep40)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep40%><br>
<% End If %>

<% if len(Rep41)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep41%><br>
<% End If %>

<% if len(Rep42)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep42%><br>
<% End If %>

<% if len(Rep43)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep43%><br>
<% End If %>


<% if len(Rep44)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep44%><br>
<% End If %>

<% if len(Rep45)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep45%><br>
<% End If %>

<% if len(Rep46)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep46%><br>
<% End If %>

<% if len(Rep47)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep47%><br>
<% End If %>

<% if len(Rep48)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep48%><br>
<% End If %>

<% if len(Rep49)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep49%><br>
<% End If %>

<% if len(Rep50)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep50%><br>
<% End If %>

<% if len(Rep51)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep51%><br>
<% End If %>

<% if len(Rep52)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep52%><br>
<% End If %>

<% if len(Rep53)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep53%><br>
<% End If %>

<% if len(Rep54)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep54%><br>
<% End If %>

<% if len(Rep55)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep55%><br>
<% End If %>

<% if len(Rep56)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep56%><br>
<% End If %>
<% if len(Rep57)> 1 Then %>
	&nbsp;&nbsp;&nbsp;<%=Rep57%><br>
<% End If %>
</small>
</td>
</tr>
</table>
<div class="container"> 
<b class="rtop"> 
  <b class="rs1"></b> <b class="rs2"></b> 
</b> 

	</td>
	</tr>
</table>

<div class="container"> 
<b class="rtop"> 
  <b class="rs1"></b> <b class="rs2"></b> 
</b> 
 <table width = "100%" >
   <tr>
     <td class = "body" >
<%  sql = "SELECT * from Sponsors where State =  '" & State & "'"
'response.write (sql)
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3   

If  Not rs.eof Then %>
	<b><%=StateName %> Sponsored Links</b><br>

<% While Not rs.eof %>
<a href = "http://<%=rs("URL")%>" target = "blank" class = "body"><b><%=rs("custname") %></b></a><br>
<%=rs("SponsorDescription")%><br>
<br>
<% 
rs.movenext
Wend

End If %>


	 </td>
	</tr>
	<tr>
	 <td class = "body">
<% if len(StateDescription)> 1 Then %>
	<b>About <%=StateName %></b><br>
	<%=StateDescription%><br><br>
<% End If 
	rs.close
	Set Conn = Nothing
%>
	 </td>
	</tr>
</table>
<div class="container"> 
<b class="rtop"> 
  <b class="rs1"></b> <b class="rs2"></b> 
</b> 
 <!--#Include virtual="/Footer.asp"--> 
</body>
</html>

