<%@ Language=VBScript %>
<%  Option Explicit

Response.ContentType = "application/vnd.ms-excel"
Response.AddHeader "Content-Disposition", "attachment; filename=excelTest.xls"
%>
<!--#Include file="GlobalVariables.asp"-->
<table>
    <tr>
        <td>Test</td>
    </tr>
</table>
