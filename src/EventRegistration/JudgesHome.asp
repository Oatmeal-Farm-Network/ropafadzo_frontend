<%@ Language=VBScript %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Content-Language" content="en-us">
<%  PageName = "Registry" %>
<!--#Include file="AdminEventGlobalVariables.asp"-->
<title>Judges Overview</title>
<meta http-equiv="Content-Language" content="en-us">
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />

</head>
<% if mobiledevice = True  then %>
<body >
<% else %>
<body onresize="window.location.replace(window.location.href.split('?')[0]  + '?ScreenWidth=' + self.innerWidth);">
<% end if %>

<% Current = "admin" %>
<!--#Include file="AdminEventsHeader.asp"-->
<% Current = "Judges" %>
<!--#Include file="OverviewHeader.asp"-->
<!'--#Include File ="JudgesHeader.asp"--> 

<%

If Request.Querystring("UpdateJudges") = "True" Then
	Description = Request.Form("Description")
	PageLayout2ID = Request.Form("PageLayout2ID")
	'response.write("ServiceID = " & ServiceID & "<br>") 
	
	str1 = Description
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Description= Replace(str1,  str2, "''")
	End If 
	 
	Query =  " UPDATE EventPageLayout2 Set PageText = '" &  Description & "'"
	Query =  Query & " where PageLayout2ID = " & PageLayout2ID & " and  EventID = " &  EventID
	Conn.Execute(Query) 

response.redirect("JudgesHome.asp?EventID=" & eventID & "&UpdateJudges=False")
end if

sql = "select * from EventpageLayout, EventPageLayout2 where EventpageLayout.PageLayoutID = EventPageLayout.PageLayoutID and EventpageLayout.EventID =  " & EventID & " and PageName ='Judges'"
'response.write("sql = " & sql)
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	PageLayout2ID = rs("PageLayout2ID")
	Description = rs("PageText")
	
	'response.write("ServicesID = " & ServicesID &"<br>")
else

Query =  "INSERT INTO EventpageLayout (EventID, PageName)" 
Query =  Query & " Values (" & EventID & "," 
Query =  Query & " 'Judges' )"
Conn.Execute(Query) 

sql = "select PageLayoutID from EventpageLayout where EventID =  " & EventID & " and PageName ='Judges'"
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	PageLayoutID = rs("PageLayoutID")
end if
response.write("sql = " & sql)

Query =  "INSERT INTO EventpageLayout2 (EventID, PageLayoutID, Blocknum)" 
Query =  Query & " Values (" & EventID & "," 
Query =  Query & " " &  PageLayoutID & "," 
Query =  Query & " 1 )"
Conn.Execute(Query) 

sql = "select * from EventpageLayout, EventPageLayout2 where EventpageLayout.PageLayoutID = EventPageLayout.PageLayoutID and EventpageLayout.EventID =  " & EventID & " and PageName ='Judges'"
response.write("sql = " & sql)
rs.Open sql, conn, 3, 3   
If Not rs.eof Then	
	PageLayout2ID = rs("PageLayout2ID")
	Description = rs("PageText")
end if


end if
%>

<table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "<%=screenwidth %>"><tr><td class = "roundedtop" align = "left">
<H1><div align = "left">Judges</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >

<table border = "0"  cellpadding=0 cellspacing=0 align = "center" >
	<tr>
	   <td valign = "top">
<br />
<table border = "0" cellspacing="0" cellpadding = "0" align = "center" >
<tr><td class = "roundedtop" align = "left">
	<H1><div align = "left">Edit Judges</div></H1>
</td></tr>
<tr><td class = "roundedBottom" > 
<table border = "0" cellpadding=0 cellspacing=0  align = "center">
<tr><td class = "body" wrap  width = "<%=screenwidth - 600 %>">
<% sql = "select * from Judges where  EventID = " & EventID
'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if  rs.eof then %>
		Currently you do not have any Judges listed. To add Judges please select  <a href = "JudgeAdd.asp?EventID=<%=EventID%>" class = "body">Add Judges</a>. 
<% else %>	
	Below are a list of the Judges that your have scheduled for your event:
<% end if %>
</td></tr>
</table>
<% Dim name(2000) 
rowcount = rowcount

row = "odd"
rowcount = 1
row = "even"

  sql = "select * from Judges where  EventID = " & EventID


'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	if not rs.eof then %>
	<br>
	<table border = "0" cellpadding=0 cellspacing=0  align = "center">
	  <tr bgcolor = "#eeeeee">
	  <td class="Menu2" align = "center" width= "60">
	      
	     </td>
	     <td class="Menu2" align = "center" width = "100">
	       <b>Name</b>
	     </td>
 		<td class="Menu2" align = "center" width = "100">
	       <b>EMail</b>
	     </td>
	     <td class="Menu2" align = "center">
	       <b>Actions</b>
	     </td>

	   </tr>
	

<%
	order = "odd"
	While Not rs.eof  
	
	JudgeFirstName = rs("JudgeFirstName")
	JudgeLastName = rs("JudgeLastName")
	Judgefax = rs("Judgefax")
	JudgeID = rs("JudgeID")
	Judgeemail = rs("Judgeemail")
	JudgeCell = rs("JudgeCell")
	JudgePhone = rs("JudgePhone")
	JudgeCell = rs("JudgeCell")
	JudgeStreet = rs("JudgeStreet")
	JudgeApt = rs("JudgeApt")
	JudgeCity = rs("JudgeCity")
	JudgeState = rs("JudgeState")
	JudgeZip = rs("JudgeZip")
	JudgeCountry = rs("JudgeCountry")
	JudgeID = rs("JudgeID")
	JudgeCountry = rs("JudgeCountry")
	JudgeImage = rs("JudgeImage")
%>

	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
	<input type = "hidden" name="JudgeID" value= "<%= JudgeID %>" >
	<% if order = "even" then 
	order = "odd"
		%>
	  <tr bgcolor = "#DBF5F3">
	<% else 
	   order = "even"%>
		<tr>
	<% end if %>
	  <td class="Menu2" align = "center" height = "25">
	      <% if len(JudgeImage) > 3 then %>
	      	<img src = "<%=JudgeImage%>" height = "25" >
	      <% end if %>
			
	     </td>
	     <td class="Menu2">
	       <a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>" class="Menu2"><%=JudgeFirstName%> &nbsp <%=JudgeLastName%></a>
	     </td>
 		<td class="Menu2" >
	      <a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>" class="Menu2"><%=Judgeemail%></a>
	     </td>
     	<td class="Menu2" align = "center">
	      <a href = "JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>&EventID=<%=EventID%>"><img src = "images/Edit.gif" width = "15" border = "0" alt = "Edit Judge"></a>  
	      <a href = "editsJudgehandle.asp?Delete=True&JudgeID=<%=JudgeID%>&JudgeID=<%=JudgeID%>&EventID=<%=EventID%>"><img src = "images/delete.jpg" width = "15" border = "0" alt = "Delete Judge"></a>

	     </td>

	   </tr>
	<tr><td class = "Menu2" colspan = "6"  height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
</table>
<% end if %>
</td></tr></table>
</td>
<% if screenwidth < 800 then %>
</tr>
<tr>
<% else %>
<td width = "5"><img src = "images/px.gif" width = "1" height = "1" /></td> 
<% end if %>
<td class = "body" valign = "top"><br />

  <table border = "0" cellspacing="0" cellpadding = "0" align = "center" width = "560"><tr><td class = "roundedtop" align = "left">
		<H1><div align = "left">Judges Description</div></H1>
</td></tr>
<tr><td class = "roundedBottom" >
<%
'*******************************************************************************************
'WYSIWYG Scripts
'*******************************************************************************************
%>  
<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg.js"></script> 

<script language="JavaScript" type="text/javascript" src="/cgi-bin/wysiwyg-settings.js"></script>

		<script language="javascript1.2">
  		// attach the editor to the textarea with the identifier 'textarea1'.
  		 WYSIWYG.attach("textarea1");
		</script>
 		  
 		  
 

	  <textarea name="Description" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%= Description%></textarea>
</td>
</tr>
</table>
</td>
</tr>
</table>
<table border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0   align = "center" >
<tr><td class = "body" align= "center">

      
<form  name=Judgesform method="post" action="JudgesHome.asp?EventID=<%=EventID%>&UpdateJudges=True">
	<input type="hidden" name="ServiceTypeLookupID" value = <%=ServiceTypeLookupID %> >
	<input type="hidden" name="PageLayout2ID" value = <%=PageLayout2ID %> >
	<input type = "hidden"  name ="EventID"  value ="<%=EventID%>">
	<input type = "hidden"  name ="EventSubTypeID"  value ="<%=EventSubTypeID%>">
	<center><input type="submit"  value="Submit Changes" class = "regsubmit2" ></center><br>
</form>

<b><i>Note: To add a Judge please select <a href = "JudgeAdd.asp?EventID=<%=eventID%>" class = "body">Add Judges</a></i></b>
    </td>
  </tr>
</table>
</td>
  </tr>
</table>


<br>
 
<!--#Include File ="Footer.asp"--> 

</Body>
</HTML>
