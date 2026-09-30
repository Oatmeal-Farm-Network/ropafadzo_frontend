<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Animal Description Edit Page</title>
       <link rel="stylesheet" type="text/css" href="style.css">



</HEAD>

<BODY  border = "0" leftmargin="10" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="/administration/Header.asp"--> 

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "white">
	<tr>
		<td class = "body">
			 <H2>Edit Animal Description <img src = "images/web.gif" ><br>
			<img src = "images/underline.jpg"></H2>
			To make changes to your descriptions, make your changes in the table below then select the "Submit Changes" button at the bottom of the page.<br><br>
		</td>
	</tr>
</table>


<%

id = "341"
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select animals.ID, animals.FullName, Description from Animals where id = " & ID

response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	rowcount = 1
	dim ID
	dim FullName
	dim Comments
	
	comments = rs("Description")
	FullName = rs("Fullname")
%>

<table border = "1" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<th width = "100" align = "center">&nbsp;Name&nbsp;</th>
		<th width = "500" id="F2"><div id="F2T" >&nbsp;Description&nbsp;</div></th>
	</tr>




	<form action= 'Descriptionhandleform.asp' method = "post">
	<tr>
		<td valign = "top" width = "100" align = "right">
			<input type = Hidden name="ID" value= "<%=ID%>" >
			<input type = Hidden name="FullName" value= "<%=  FullName%>" >
			<%=  FullName%></td>
		<td width = "100">
		<textarea name="Comments" cols="73" rows="8" wrap="VIRTUAL" ><%= Comments%></textarea>
		</td>
	</tr>
	

<%

TotalCount=rowcount 
	rs.close
  set rs=nothing
  set conn = nothing
%>
<tr>
		<td colspan = "4" align = "center" valign = "middle">
			<img src = "images/underline.jpg"><br>
			<Input type = Hidden name='TotalCount' value = <%=TotalCount%> >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "menu" >
			</form>
		</td>
</tr>
</table>
 
<!--#Include virtual="/administration/Footer.asp"--> </Body>
</HTML>