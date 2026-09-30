<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<%@ Language=VBScript %>

<HTML>
<HEAD>
 <title>Edit Pages</title>
       <link rel="stylesheet" type="text/css" href="style.css">
<!--#Include file="AdminEventGlobalVariables.asp"-->
<%
EventID= Request.Querystring("EventID")
Currentpagename = "JudgesAddJudge.asp"

sql3 = "select * from Services, serviceTypeLookup where services.ServiceTypeLookupID = serviceTypeLookup.ServiceTypeLookupID and  EventID = " & session("EventID")

Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql3, conn, 3, 3   
while Not rs.eof 

 
	if rs("ServiceType") = "Halter Show" then
       ShowHalterShow = True 
     End If
 
     if rs("ServiceType") = "Fleece Show" then
       ShowFleeceShow = True 
     End If

   

     if rs("ServiceType") = "Spin-off" then
       ShowSpinOff = True
     End If
rs.movenext
wend
%>
</HEAD>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">
<!--#Include file="Header.asp"-->
<% PageTitleText = "Edit Judge"
Current = "Judges"  %>
<!--#Include file="JudgesHeader.asp"-->

<table border = "0" cellpadding=0 cellspacing=0 width = "900" align = "center">
<tr><td class="Menu2">
<% Completion = request.querystring("Completion")

if Completion="True" then %>
  <font color = "Brown">Your Judge has been updated. To edit another Judge please select <a href = "JudgeEditJudges.asp?EventID=<%=EventID%>" class = "Menu2" >Edit Judges</a>.</font>

<% end if %>
			
		</td>
	</tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>

<%
row = "odd"
rowcount = 1
row = "even"


JudgeID= request.querystring("JudgeID")
	
 sql = "select * from judges where JudgeID=" & JudgeID

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	
	if Not rs.eof then
	
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
JudgeWebsite= rs("JudgeWebsite")  
JudgeBio= rs("JudgeBio")  
	%>
	<form  action="editsJudgehandle.asp?EventID=<%=EventID%>" method = "post">
	<input type = "hidden" name="EventID" value= "<%= EventID %>" >
	<input type = "hidden" name="JudgeID" value= "<%=JudgeID %>" >
	<table border = "0" width = "940"  align = "center" bgcolor = "white">

<table width = "965" border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr ><td align = "center">



<table border = "0"  cellpadding=0 cellspacing=0 width = "960" align = "right" >
<tr><td width = "444" valign = "top">
<form  name=form method="post" action="JudgesAddJudgeHandleForm.asp">

<% PageTitleText = "Name & Judge"  %>
<br />
 
<table width = "504" border = "0"  leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
<tr>
			<td class = "body2" colspan = "2">
					<b>This person will be a judge for the following:</b> &nbsp;
				</td>
			</tr>
			<tr>
			<td class = "body2" align = "right" WIDTH = "150">
					 &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
				    <% if ShowHalterShow = True then 
				   sqlb = "select * from Judgesshows where  EventID = " & EventID & " and JudgeID= " & JudgeID & " and ShowType = 'Halter'"
   					Set rsb = Server.CreateObject("ADODB.Recordset")
   					rsb.Open sqlb, conn, 3, 3   
					if not rsb.eof then
						HalterJudge  = True
   					end if
   					rsb.close

					if HalterJudge  = True then
				   %>
				     <input type="checkbox" name="JudgeShow" value="HalterJudge" Checked> Halter Show Judge<br >
					<% else %>
					   <input type="checkbox" name="JudgeShow" value="HalterJudge" > Halter Show Judge<br >
				   <% end if %>
				     <% end if %>
				     
				     
				     
				   <% if ShowFleeceShow = True then 
				   sqlb = "select * from Judgesshows where  EventID = " & EventID & " and JudgeID= " & JudgeID & " and ShowType = 'Fleece'"
   					Set rsb = Server.CreateObject("ADODB.Recordset")
   					rsb.Open sqlb, conn, 3, 3   
					if not rsb.eof then
						FleeceJudge  = True
   					end if
   					rsb.close

					if FleeceJudge  = True then
				   %>
				     <input type="checkbox" name="JudgeShow" value="FleeceJudge" Checked> Fleece Show Judge<br >
					<% else %>
					   <input type="checkbox" name="JudgeShow" value="FleeceJudge" > Fleece Show Judge<br >
				   <% end if %>
				     <% end if %>



 				<% if ShowSpinOff = True then 
				   sqlb = "select * from Judgesshows where  EventID = " & EventID & " and JudgeID= " & JudgeID & " and ShowType = 'SpinOff'"
   					Set rsb = Server.CreateObject("ADODB.Recordset")
   					rsb.Open sqlb, conn, 3, 3   
					if not rsb.eof then
						SpinOffJudge  = True
   					end if
   					rsb.close

					if SpinOffJudge  = True then
				   %>
				     <input type="checkbox" name="JudgeShow" value="SpinOffJudge" Checked> Spin-Off Show Judge<br >
					<% else %>
					   <input type="checkbox" name="JudgeShow" value="SpinOffJudge" > Spin-Off Show Judge<br >
				   <% end if %>
				     <% end if %>

				</td>
			</tr>
<tr>
				<td class = "body2" align = "right" WIDTH = "150">
					First Name:* &nbsp;
				</td>
				<td class = "body2" align = "left" WIDTH = "300">
					<input name="JudgeFirstName" Value ="<%=JudgeFirstName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			<tr>
				<td class = "body2" align = "right">
					Last Name:* &nbsp;
				</td>
				<td class = "body2">
					<input name="JudgeLastName" Value ="<%=JudgeLastName%>"  size = "33" maxlength = "61">
				</td>
			</tr>
			
<tr>
	<td class = "body2" align = "right">
			Website: &nbsp;
		</td>
		<td class = "body2">
			http://<input name="JudgeWebsite" Value ="<%=JudgeWebsite%>"  size = "30" maxlength = "61">
		</td>
	</tr>
	<tr>
			<td   class = "body2" align = "right">
				Phone: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="JudgePhone"  size = "30" value = "<%=JudgePhone%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Cell: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="JudgeCell"  size = "30" value = "<%=JudgeCell%>">
			</td>
		</tr>
		<tr>
			<td   class = "body2" align = "right">
				Fax: &nbsp;
			</td>
			<td  align = "left" valign = "top" class = "body2">
				<input name="JudgeFax"  size = "30" value = "<%=JudgeFax%>">
			</td>
		</tr>
		<tr>
		<td colspan = "2" class = "body">
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
 		  Judges Biography
 		   <textarea name="JudgeBio" cols="60" rows="6" wrap="VIRTUAL" id = "textarea1"><%=JudgeBio%></textarea>
		</td>
		</tr>
		<tr><td  align = "center" colspan = "2">
        <input name="CurrentJudgeID" type = "hidden"  value = "<%=CurrentJudgeID%>">
         <input name="EventID" type = "hidden"  value = "<%=EventID%>">
		<center><input type=submit value="Update" class = "regsubmit2" ></center>
</td></tr>
</table>						
			</form>			

</td>
<td width = "5"><img src= "images/px.gif" height = "1" width = "1" /></td>
<td valign = "top" class = "body"><img src= "images/px.gif" height = "19" width = "442" />
<% PageTitleText = "Image"  %>

<table border = "0"  cellpadding=0 cellspacing=0 width = "442" height = "200" align = "center" >
<tr><td width = "442" valign = "top" class = "body"></br><br /></br>
	<% If Len(JudgeImage) > 2 Then %>
							<img src = "<%=JudgeImage%>" height = "100">
	<% Else %>
							<b>No Image</b>
			<% End If %>

<td>
</tr>
<tr>
<td class=  "body">
<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadImageJudge.asp?JudgeID=<%=JudgeID%>" >
								Upload Logo: <br>Images must be in JPG, JPEG, GIF, or PNG format and under 500KB in size.
								<input name="attach1" type="file" size=35 class = "regsubmit2">
								<center><input  type=submit value="Upload" class = "regsubmit2" ></center>
							</form>
							
						<td>
						</tr>
						<% If Len(JudgeImage) > 2 Then %>
						<tr>
					    <td class = "body">
		<form action= 'JudgeRemoveImage.asp' method = "post">
		<input type = "hidden" name="JudgeID" value= "<%=JudgeID%>" >
		<input name="ReturnPage" Value ="JudgesEditJudgesDetails.asp?JudgeID=<%=JudgeID%>" type="hidden">
		<center><input type=submit class = "regsubmit2"  value="Remove Image"></center>
		</form>
	</td>
</tr>

<% End If %>
</table>
<% End If %>
</td>
</tr>
</table>

 </td></tr></table>
 

 
<!--#Include file="Footer.asp"--> </Body>
</HTML>